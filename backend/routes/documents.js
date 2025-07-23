// routes/documents.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db");
const router = express.Router();
const PDFDocument = require("pdfkit");

const uploadPath = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),
  filename: (_, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.post("/upload", upload.single("document"), (req, res) => {
  const { lan, filename } = req.body;
  const storedName = req.file.filename;

  db.query(
    `INSERT INTO loan_documents (lan, file_name, original_name, uploaded_at) VALUES (?, ?, ?, NOW())`,
    [lan, storedName, filename || req.file.originalname],
    (err) => {
      if (err) return res.status(500).json({ error: "DB Insert Failed" });
      res.status(200).json({ message: "Uploaded" });
    }
  );
});

router.get("/:lan", (req, res) => {
  const lan = req.params.lan;
  db.query(
    `SELECT id, file_name, original_name, uploaded_at FROM loan_documents WHERE lan = ? ORDER BY uploaded_at DESC`,
    [lan],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB Fetch Failed" });
      res.json(rows);
    }
  );
});


const safeNum = (x) => Number(x) || 0;

const formatDate = (d) => {
  return new Date(d).toLocaleDateString("en-GB").split('/').reverse().join('-');
};

router.post("/generate-soa", async (req, res) => {
  const { lan } = req.body;

  let loanTable = "";
  let rpsTable = "";
  let paymentsTable = "";
  let chargesTable = "";

  if (lan.startsWith("GQN")) {
    loanTable = "loan_booking_gq_non_fsf";
    rpsTable = "manual_rps_gq_non_fsf";
    paymentsTable = "repayments_upload";
    chargesTable = "loan_charges";
  } else if (lan.startsWith("GQF")) {
    loanTable = "loan_booking_gq_fsf";
    rpsTable = "manual_rps_gq_fsf";
    paymentsTable = "repayments_upload";
    chargesTable = "loan_charges";
  } else if (lan.startsWith("ADK")) {
    loanTable = "loan_booking_adikosh";
    rpsTable = "manual_rps_adikosh";
    paymentsTable = "repayments_upload_adikosh";
    chargesTable = "loan_charges";
  } else {
    loanTable = "loan_bookings";
    rpsTable = "manual_rps_ev_loan";
    paymentsTable = "repayments_upload";
    chargesTable = "loan_charges";
  }

  try {
    const [loanRows] = await db.promise().query(`SELECT * FROM ${loanTable} WHERE lan = ?`, [lan]);
    const loan = loanRows[0] || {};

    const [rpsRows] = await db.promise().query(
      `SELECT due_date, emi FROM ${rpsTable} WHERE lan = ? AND due_date <= CURDATE() ORDER BY due_date`,
      [lan]
    );

    const [chargesRows] = await db.promise().query(
      `SELECT due_date, charge_type, amount FROM ${chargesTable} WHERE lan = ? AND due_date <= CURDATE() ORDER BY due_date`,
      [lan]
    );

    const [paymentRows] = await db.promise().query(
      `SELECT bank_date AS payment_date, payment_mode, transfer_amount FROM ${paymentsTable} WHERE lan = ? AND bank_date <= CURDATE() ORDER BY bank_date`,
      [lan]
    );

    let closing = 0;
    const finalRows = [];

    // Prepare payment pool
    let remainingPayments = [];
    paymentRows.forEach(p => {
      remainingPayments.push({
        date: p.payment_date,
        mode: p.payment_mode,
        amount: safeNum(p.transfer_amount)
      });
    });

    const allDebits = [];

    rpsRows.forEach(rps => {
      allDebits.push({
        due_date: rps.due_date,
        description: 'EMI Due',
        charge_type: 'EMI',
        amount: safeNum(rps.emi)
      });
    });

    chargesRows.forEach(c => {
      allDebits.push({
        due_date: c.due_date,
        description: 'Penalty Charge',
        charge_type: c.charge_type,
        amount: safeNum(c.amount)
      });
    });

    allDebits.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    // Knock-off logic - alternate debit/credit
    for (let debitItem of allDebits) {
      // Debit Row
      const opening = closing;
      closing = opening + debitItem.amount;

      finalRows.push({
        due_date: formatDate(debitItem.due_date),
        description: debitItem.description,
        charge_type: debitItem.charge_type,
        debit: debitItem.amount.toFixed(2),
        credit: '0.00',
        opening: opening.toFixed(2),
        closing: closing.toFixed(2),
      });

      // Knock-off from payments
      while (debitItem.amount > 0 && remainingPayments.length > 0) {
        let payment = remainingPayments[0];
        const knockAmount = Math.min(debitItem.amount, payment.amount);

        const openingCr = closing;
        closing = openingCr - knockAmount;

        finalRows.push({
          due_date: formatDate(payment.date),
          description: 'Repayment Received',
          charge_type: payment.mode,
          debit: '0.00',
          credit: knockAmount.toFixed(2),
          opening: openingCr.toFixed(2),
          closing: closing.toFixed(2),
        });

        debitItem.amount -= knockAmount;
        payment.amount -= knockAmount;

        if (payment.amount <= 0) {
          remainingPayments.shift(); // Move to next payment
        }
      }
    }

    // === PDF Generation ===
    const doc = new PDFDocument({ margin: 40 });
    const filename = `SOA_${lan}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, `../generated/${filename}`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.image(path.join(__dirname, "../public/fintree-logo.png"), { fit: [100, 100], align: "center" })
      .moveDown(0.5)
      .fontSize(14)
      .text("Statement Of Account", { align: "center" })
      .moveDown()
      .fontSize(12)
      .text(`Customer Name: ${loan.customer_name || "-"}`)
      .text(`Loan Account No: ${loan.lan || "-"}`)
      .text(`Partner Loan ID: ${loan.partner_loan_id || "-"}`)
      .text(`Date: ${new Date().toLocaleDateString("en-IN")}`)
      .moveDown();

    // Table
    const rowHeight = 20;
    const startX = 40;
    let y = doc.y + 20;

    const colWidths = [80, 100, 70, 60, 60, 70, 70];
    const headers = ["Due Date", "Description", "Charge", "Debit", "Credit", "Opening", "Closing"];

    let x = startX;
    doc.font('Helvetica-Bold').fontSize(10);
    headers.forEach((h, i) => {
      doc.rect(x, y, colWidths[i], rowHeight).stroke();
      doc.text(h, x + 2, y + 5, { width: colWidths[i] - 4 });
      x += colWidths[i];
    });
    y += rowHeight;

    doc.font('Helvetica').fontSize(9);

    finalRows.forEach(row => {
      x = startX;
      const values = [
        row.due_date,
        row.description,
        row.charge_type,
        row.debit,
        row.credit,
        row.opening,
        row.closing,
      ];

      values.forEach((val, i) => {
        doc.rect(x, y, colWidths[i], rowHeight).stroke();
        doc.text(val, x + 2, y + 5, { width: colWidths[i] - 4 });
        x += colWidths[i];
      });

      y += rowHeight;

      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        y = 50;
      }
    });

    doc.moveDown(2)
      .fontSize(10)
      .text("***This is a system generated letter and does not require a signature***", 50, doc.y);

    doc.end();

    writeStream.on("finish", async () => {
      await db.promise().query(
        `INSERT INTO loan_documents (lan, file_name, original_name) VALUES (?, ?, ?);`,
        [lan, filePath, filename]
      );
      res.json({ fileUrl: `http://192.168.0.200:5000/generated/${filename}` });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SOA generation failed", details: err.message });
  }
});




router.post("/generate-noc", async (req, res) => {
  const { lan } = req.body;

  let loanTable = "";
  if (lan.startsWith("GQN")) {
    loanTable = "loan_booking_gq_non_fsf";
  } else if (lan.startsWith("GQF")) {
    loanTable = "loan_booking_gq_fsf";
  } else if (lan.startsWith("ADK")) {
    loanTable = "loan_booking_adikosh";
  } else {
    loanTable = "loan_bookings";
  }

  try {
    const [loanRows] = await db
      .promise()
      .query(`SELECT * FROM ${loanTable} WHERE lan = ?`, [lan]);

    const loan = loanRows[0] || {};

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ margin: 50 });

    const filename = `NOC_${lan}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "../uploads", filename);

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // ✅ Logo + Title
    doc
      .image(path.join(__dirname, "../public/fintree-logo.png"), {
        fit: [120, 120],
        align: "center",
      })
      .moveDown(0.5)
      .fontSize(16)
      .text("No Dues Certificate", { align: "center", underline: true });

    doc.moveDown();

    // ✅ Top Details
    doc
      .fontSize(12)
      .text(`Date: ${new Date().toLocaleDateString()}`)
      .moveDown(0.5)
      .text(`Name of the Borrower: ${loan.customer_name || ""}`)
      .text(`Ref.: Loan Account Number: ${loan.lan || ""}`)
      .text(`Ref.: Partner Loan Account Number: ${loan.partner_loan_id || ""}`)
      .text(
        `Address of the Borrower: ${[
          loan.address_line_1,
          loan.address_line_2,
          loan.village,
          loan.district,
          loan.state,
          loan.pincode,
        ]
          .filter(Boolean)
          .join(", ")}`
      );

    doc.moveDown(1);

    // ✅ Body
    doc.fontSize(12).text("Dear Sir/Madam,").moveDown(1);

    doc
      .text(
        "We would like to thank you for your patronage, and we do hope that your experience with us has been a rewarding one."
      )
      .moveDown(1);

    doc
      .text(
        "We are pleased to confirm that there are no outstanding dues towards the captioned loan and the loan amount disbursed under the said loan account number has been closed in our books. The agreement signed by you with this regard stands terminated."
      )
      .moveDown(1);

    doc
      .text(
        "We will be happy to welcome you back! Fintree Finance Pvt. Ltd. is now a one stop solution for all financial needs. Our array of offerings includes Consumer Durable Loans, Personal Loans, Vehicle Loans, Business Loans and Mortgage Loans."
      )
      .moveDown(1);

    doc
      .text(
        "Thank you once again for selecting Fintree Finance Pvt Ltd as your preferred partner in helping you accomplish your financial goals."
      )
      .moveDown(2);

    doc.text("For and on behalf of Fintree Finance Pvt Ltd");

    doc
      .moveDown(2)
      .fontSize(10)
      .text(
        "***This is a system generated letter and does not require a signature***",
        { align: "center" }
      );

    doc.end();

    writeStream.on("finish", async () => {
      const publicUrl = `/uploads/${filename}`;
      await db
        .promise()
        .query(
          `INSERT INTO loan_documents (lan, file_name, original_name, uploaded_at) VALUES (?, ?, ?, NOW())`,
          [lan, publicUrl, filename]
        );
      res.status(200).json({
        message: "Generated",
        fileUrl: publicUrl,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "NOC generation failed" });
  }
});

module.exports = router;
