


// const express = require("express");
// const multer = require("multer");
// const xlsx = require("xlsx");
// const db = require("../config/db");

// const router = express.Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const queryDB = (sql, params) => {
//   return new Promise((resolve, reject) => {
//     db.query(sql, params, (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// // ✅ Excel serial date to JS date (YYYY-MM-DD)
// const excelSerialDateToJS = (value) => {
//   if (!value) return null;

//   if (!isNaN(value)) {
//     const excelEpoch = new Date(Date.UTC(1899, 11, 30));
//     return new Date(excelEpoch.getTime() + value * 86400000)
//       .toISOString()
//       .split("T")[0];
//   }

//   if (typeof value === "string" && value.match(/^\d{2}-[A-Za-z]{3}-\d{2}$/)) {
//     const [day, monthAbbr, yearShort] = value.split("-");
//     const monthNames = {
//       Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
//       Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
//     };
//     const month = monthNames[monthAbbr];
//     const year = parseInt("20" + yearShort, 10);
//     return new Date(Date.UTC(parseInt(day), month, year))
//       .toISOString()
//       .split("T")[0];
//   }

//   return null;
// };

// // ✅ Procedure call dispatcher
// const callRepaymentProcedure = async (lan, payments) => {
//   try {
//     payments.sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date));

//     for (const payment of payments) {
//       console.log(`🔄 Processing Payment for LAN: ${lan}, Amount: ${payment.transfer_amount}, Date: ${payment.payment_date}, Payment ID: ${payment.payment_id}`);

//       // ✅ Step 1: Generate penal charge
//       await queryDB(`CALL sp_generate_penal_charge(?, ?)`, [lan, payment.payment_date]);

//       // ✅ Step 2: Determine procedure(s) to call
//       if (lan.startsWith("GQN")) {
//         console.log(`⚙️ Calling procedure: sp_update_repayment_schedule_gq`);
//         await queryDB(`CALL sp_update_repayment_schedule_gq(?, ?, ?, ?)`, [
//           lan,
//           payment.transfer_amount,
//           payment.payment_date,
//           payment.payment_id
//         ]);
//       } else if (lan.startsWith("ADK")) {
//         console.log(`⚙️ Calling procedure: sp_update_repayment_schedule_adikosh`);
//         await queryDB(`CALL sp_update_repayment_schedule_adikosh(?, ?, ?, ?)`, [
//           lan,
//           payment.transfer_amount,
//           payment.payment_date,
//           payment.payment_id
//         ]);

//         console.log(`⚙️ Calling procedure: sp_update_repayment_schedule_adikosh_partner`);
//         await queryDB(`CALL sp_update_repayment_schedule_adikosh_partner(?, ?, ?, ?)`, [
//           lan,
//           payment.transfer_amount,
//           payment.payment_date,
//           payment.payment_id
//         ]);

//         console.log(`⚙️ Calling procedure: sp_update_repayment_schedule_adikosh_fintree`);
//         await queryDB(`CALL sp_update_repayment_schedule_adikosh_fintree(?, ?, ?, ?)`, [
//           lan,
//           payment.transfer_amount,
//           payment.payment_date,
//           payment.payment_id
//         ]);
//       } else if (lan.startsWith("GQF")) {
//         console.log(`⚙️ Calling procedure: sp_update_repayment_schedule_gq_fsf`);
//         await queryDB(`CALL sp_update_repayment_schedule_gq_fsf(?, ?, ?, ?)`, [
//           lan,
//           payment.transfer_amount,
//           payment.payment_date,
//           payment.payment_id
//         ]); 
//       } else {
//         console.log(`⚙️ Calling procedure: sp_update_repayment_schedule`);
//         await queryDB(`CALL sp_update_repayment_schedule(?, ?, ?, ?)`, [
//           lan,
//           payment.transfer_amount,
//           payment.payment_date,
//           payment.payment_id
//         ]);
//       }
//     }
//   } catch (error) {
//     console.error(`❌ Error executing procedures for LAN: ${lan}`, error);
//   }
// };
// router.post("/upload", upload.single("file"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//   let processedCount = 0;
//   let missingLANs = [];
//   let duplicateUTRs = [];
//   let repaymentData = [];
//   let lanPayments = {};

//   try {
//     const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//     const sheetDataRaw = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
//     if (!sheetDataRaw || sheetDataRaw.length === 0) {
//       return res.status(400).json({ message: "Uploaded Excel file is empty or invalid." });
//     }

//     const sheetData = sheetDataRaw.map((row) => {
//       const cleaned = {};
//       for (const key in row) {
//         cleaned[key.trim()] = row[key];
//       }
//       return cleaned;
//     });

//     const lanValues = sheetData
//       .filter((row) => row["LAN"])
//       .map((row) => row["LAN"]);

//     if (lanValues.length === 0) {
//       return res.status(400).json({ message: "No valid LANs found in the file." });
//     }

//     const uniqueLANs = [...new Set(lanValues)];
//     console.log("Extracted LANs:", uniqueLANs);

//     // ✅ Detect which LANs are GQ or ADK or Default
//     const gqLANs = [];
//     const gqFLANs = [];
//     const adkLANs = [];
//     const otherLANs = [];
    
//     for (const lan of uniqueLANs) {
//       if (lan.startsWith("GQN")) {
//         gqLANs.push(lan);
//       } else if (lan.startsWith("GQF")) {
//         gqFLANs.push(lan);
//       } else if (lan.startsWith("ADK")) {
//         adkLANs.push(lan);
//       } else {
//         otherLANs.push(lan);
//       }
//     }
    
//     // ✅ Query all relevant LANs from all 3 booking tables
//     const gqQuery = gqLANs.length > 0
//     ? queryDB(`SELECT lan FROM loan_booking_gq_non_fsf WHERE lan IN (?)`, [gqLANs])
//     : Promise.resolve([]);

//     const gqFQuery = gqFLANs.length > 0
//     ? queryDB(`SELECT lan FROM loan_bookings_gq_fsf WHERE lan IN (?)`, [gqFLANs])
//     : Promise.resolve([]);
  
//   const adkQuery = adkLANs.length > 0
//     ? queryDB(`SELECT lan FROM loan_booking_adikosh WHERE lan IN (?)`, [adkLANs])
//     : Promise.resolve([]);
  
//   const otherQuery = otherLANs.length > 0
//     ? queryDB(`SELECT lan FROM loan_bookings WHERE lan IN (?)`, [otherLANs])
//     : Promise.resolve([]);
  
//   const [gqResults, gqFResults, adkResults, defaultResults] = await Promise.all([
//     gqQuery,
//     gqFQuery,
//     adkQuery,
//     otherQuery
//   ]);
  

//     const validLANs = new Set([
//       ...gqResults.map((r) => r.lan),
//       ...gqFResults.map((r) => r.lan),
//       ...adkResults.map((r) => r.lan),
//       ...defaultResults.map((r) => r.lan)
//     ]);

//     for (let row of sheetData) {
//       const lan = row["LAN"];
//       const bank_date = excelSerialDateToJS(row["Bank Date"]);
//       const utr = row["UTR"];
//       const payment_date = excelSerialDateToJS(row["Payment Date"]);
//       const payment_id = row["Payment Id"];
//       const payment_mode = row["Payment Mode"];
//       const transfer_amount = row["Transfer Amount"];

//       if (!lan || !utr || !payment_date || !transfer_amount) {
//         console.warn("⚠️ Skipping row due to missing data:", row);
//         continue;
//       }

//       if (!validLANs.has(lan)) {
//         missingLANs.push(lan);
//         continue;
//       }

//       const utrCheckTable = lan.startsWith("ADK") ? "repayments_upload_adikosh" : "repayments_upload";
//       const utrCheck = await queryDB(`SELECT COUNT(*) AS count FROM ${utrCheckTable} WHERE utr = ?`, [utr]);
//       if (utrCheck[0].count > 0) {
//         duplicateUTRs.push(utr);
//         continue;
//       }

//       repaymentData.push([
//         lan,
//         bank_date,
//         utr,
//         payment_date,
//         payment_id,
//         payment_mode,
//         transfer_amount
//       ]);

//       if (!lanPayments[lan]) lanPayments[lan] = [];
//       lanPayments[lan].push({ bank_date, utr, payment_date, payment_id, payment_mode, transfer_amount });
//     }

//     if (repaymentData.length > 0) {
//       // ✅ Insert into appropriate table
//       const adkRows = repaymentData.filter((r) => r[0].startsWith("ADK"));
//       const otherRows = repaymentData.filter((r) => !r[0].startsWith("ADK"));

//       if (adkRows.length > 0) {
//         await queryDB(
//           `INSERT INTO repayments_upload_adikosh (lan, bank_date, utr, payment_date, payment_id, payment_mode, transfer_amount) VALUES ?`,
//           [adkRows]
//         );
//         processedCount += adkRows.length;
//       }

//       if (otherRows.length > 0) {
//         await queryDB(
//           `INSERT INTO repayments_upload (lan, bank_date, utr, payment_date, payment_id, payment_mode, transfer_amount) VALUES ?`,
//           [otherRows]
//         );
//         processedCount += otherRows.length;
//       }

//       // ✅ Call SPs per LAN
//       for (const lan in lanPayments) {
//         await callRepaymentProcedure(lan, lanPayments[lan]);
//       }
//     }

//     res.json({
//       message: `Repayment file processed. ${processedCount} records inserted.`,
//       missing_lans: missingLANs,
//       duplicate_utr: duplicateUTRs
//     });
//   } catch (error) {
//     console.error("❌ Error processing repayment file:", error);
//     res.status(500).json({ message: "Error processing repayment file" });
//   }
// });


// module.exports = router;


// const express = require("express");
// const multer = require("multer");
// const xlsx = require("xlsx");
// const db = require("../config/db");
// const { allocateRepaymentByLAN } = require("../utils/allocate");
// const { excelSerialDateToJS, queryDB } = require("../utils/helpers");

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// router.post("/upload", upload.single("file"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//   const successRows = [];
//   const failedRows = [];
//   const missingLANs = [];
//   const duplicateUTRs = [];

//   try {
//     const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//     const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
//     const sheetData = sheet.map((row, i) => ({ ...row, __row: i + 2 }));

//     console.log(`📥 Total Rows in Excel: ${sheetData.length}`);
//     if (sheetData.length === 0) {
//       return res.status(400).json({ message: "Empty or invalid file" });
//     }

//     const uniqueLANs = [...new Set(sheetData.map(r => r["LAN"]).filter(Boolean))];
//     const lanResults = await Promise.all([
//       queryDB(`SELECT lan FROM loan_booking_gq_non_fsf WHERE lan IN (?)`, [uniqueLANs]),
//       queryDB(`SELECT lan FROM loan_booking_gq_fsf WHERE lan IN (?)`, [uniqueLANs]),
//       queryDB(`SELECT lan FROM loan_booking_adikosh WHERE lan IN (?)`, [uniqueLANs]),
//       queryDB(`SELECT lan FROM loan_bookings WHERE lan IN (?)`, [uniqueLANs]),
//     ]);
//     const validLANs = new Set(lanResults.flat().map(r => r.lan));

//     for (const row of sheetData) {
//       const rowNumber = row.__row;
//       const lan = row["LAN"];
//       const utr = row["UTR"];
//       const bank_date = excelSerialDateToJS(row["Bank Date"]);
//       const payment_date = excelSerialDateToJS(row["Payment Date"]);
//       const payment_id = row["Payment Id"];
//       const payment_mode = row["Payment Mode"];
//       const transfer_amount = row["Transfer Amount"];

//       if (!lan || !utr || !payment_date || !payment_id || !transfer_amount) {
//         console.warn(`⚠️ Row ${rowNumber}: Missing required fields`, row);
//         failedRows.push({ row: rowNumber, reason: "Missing required fields" });
//         throw new Error(`❌ Fatal: Required data missing in row ${rowNumber} — upload stopped.`);
//       }

//       if (!validLANs.has(lan)) {
//         console.warn(`❌ Row ${rowNumber}: Invalid LAN (${lan})`);
//         missingLANs.push(lan);
//         failedRows.push({ row: rowNumber, reason: "LAN not found" });
//         throw new Error(`❌ Fatal: Invalid LAN in row ${rowNumber} — upload stopped.`);
//       }

//       const table = lan.startsWith("ADK") ? "repayments_upload_adikosh" : "repayments_upload";
//       const [utrCheck] = await queryDB(`SELECT COUNT(*) AS count FROM ${table} WHERE utr = ?`, [utr]);

//       if (utrCheck.count > 0) {
//         console.error(`❌ Row ${rowNumber}: Duplicate UTR (${utr})`);
//         duplicateUTRs.push(utr);
//         failedRows.push({ row: rowNumber, reason: "Duplicate UTR" });
//         throw new Error(`❌ Fatal: Duplicate UTR in row ${rowNumber} — upload stopped.`);
//       }

//       // Insert and allocate — any error here stops all further processing
//       await queryDB(
//         `INSERT INTO ${table} (lan, bank_date, utr, payment_date, payment_id, payment_mode, transfer_amount)
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [lan, bank_date, utr, payment_date, payment_id, payment_mode, transfer_amount]
//       );
//       console.log(`✅ Row ${rowNumber}: Inserted into ${table}`);

//       await allocateRepaymentByLAN(lan, {
//         lan, bank_date, utr, payment_date, payment_id, payment_mode, transfer_amount
//       });

//       console.log(`✅ Row ${rowNumber}: Allocation done`);
//       successRows.push(rowNumber);
//     }

//     console.log(`📊 Summary: Inserted ${successRows.length} | Failed ${failedRows.length}`);

//     res.json({
//       message: "✅ Upload successful",
//       total_rows: sheetData.length,
//       inserted_rows: successRows.length,
//       failed_rows: failedRows.length,
//       success_rows: successRows,
//       failed_details: failedRows,
//       missing_lans: missingLANs,
//       duplicate_utrs: duplicateUTRs,
//     });
//   } catch (err) {
//     console.error("❌ Upload stopped:", err.message);
//     res.status(500).json({
//       message: "❌ Upload stopped due to error",
//       inserted_rows: successRows.length,
//       failed_rows: failedRows.length,
//       success_rows: successRows,
//       failed_details: failedRows,
//       missing_lans: missingLANs,
//       duplicate_utrs: duplicateUTRs,
//       error: err.message,
//     });
//   }
// });

// module.exports = router;


///////////////////////////   WITH PENAL CHARGES //////////////////
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const db = require("../config/db");
const { allocateRepaymentByLAN } = require("../utils/allocate");
const { excelSerialDateToJS, queryDB } = require("../utils/helpers");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const successRows = [];
  const failedRows = [];
  const missingLANs = [];
  const duplicateUTRs = [];

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const sheetData = sheet.map((row, i) => ({ ...row, __row: i + 2 }));

    console.log(`📥 Total Rows in Excel: ${sheetData.length}`);
    if (sheetData.length === 0) {
      return res.status(400).json({ message: "Empty or invalid file" });
    }

    const uniqueLANs = [...new Set(sheetData.map(r => r["LAN"]).filter(Boolean))];
    const lanResults = await Promise.all([
      queryDB(`SELECT lan FROM loan_booking_gq_non_fsf WHERE lan IN (?)`, [uniqueLANs]),
      queryDB(`SELECT lan FROM loan_booking_gq_fsf WHERE lan IN (?)`, [uniqueLANs]),
      queryDB(`SELECT lan FROM loan_booking_adikosh WHERE lan IN (?)`, [uniqueLANs]),
      queryDB(`SELECT lan FROM loan_bookings WHERE lan IN (?)`, [uniqueLANs]),
    ]);
    const validLANs = new Set(lanResults.flat().map(r => r.lan));

    for (const row of sheetData) {
      const rowNumber = row.__row;
      const lan = row["LAN"];
      const utr = row["UTR"];
      const bank_date = excelSerialDateToJS(row["Bank Date"]);
      const payment_date = excelSerialDateToJS(row["Payment Date"]);
      const payment_id = row["Payment Id"];
      const payment_mode = row["Payment Mode"];
      const transfer_amount = row["Transfer Amount"];

      if (!lan || !utr || !payment_date || !payment_id || !transfer_amount) {
        console.warn(`⚠️ Row ${rowNumber}: Missing required fields`, row);
        failedRows.push({ row: rowNumber, reason: "Missing required fields" });
        throw new Error(`❌ Fatal: Required data missing in row ${rowNumber} — upload stopped.`);
      }

      if (!validLANs.has(lan)) {
        console.warn(`❌ Row ${rowNumber}: Invalid LAN (${lan})`);
        missingLANs.push(lan);
        failedRows.push({ row: rowNumber, reason: "LAN not found" });
        throw new Error(`❌ Fatal: Invalid LAN in row ${rowNumber} — upload stopped.`);
      }

      const table = lan.startsWith("ADK") ? "repayments_upload_adikosh" : "repayments_upload";
      const [utrCheck] = await queryDB(`SELECT COUNT(*) AS count FROM ${table} WHERE utr = ?`, [utr]);

      if (utrCheck.count > 0) {
        console.error(`❌ Row ${rowNumber}: Duplicate UTR (${utr})`);
        duplicateUTRs.push(utr);
        failedRows.push({ row: rowNumber, reason: "Duplicate UTR" });
        throw new Error(`❌ Fatal: Duplicate UTR in row ${rowNumber} — upload stopped.`);
      }

      // ✅ 1️⃣ Call Penal Charge SP
      console.log(`🔄 Row ${rowNumber}: Generating Penal Charge before insert...`);
      await queryDB(`CALL sp_generate_penal_charge(?,?)`, [lan,payment_date]);
      console.log(`✅ Row ${rowNumber}: Penal Charge SP done.`);

      // ✅ 2️⃣ Insert repayment
      await queryDB(
        `INSERT INTO ${table} (lan, bank_date, utr, payment_date, payment_id, payment_mode, transfer_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [lan, bank_date, utr, payment_date, payment_id, payment_mode, transfer_amount]
      );
      console.log(`✅ Row ${rowNumber}: Inserted into ${table}`);

      // ✅ 3️⃣ Allocate knock-off
      await allocateRepaymentByLAN(lan, {
        lan, bank_date, utr, payment_date, payment_id, payment_mode, transfer_amount
      });
      console.log(`✅ Row ${rowNumber}: Allocation done`);

      successRows.push(rowNumber);
    }

    console.log(`📊 Summary: Inserted ${successRows.length} | Failed ${failedRows.length}`);

    res.json({
      message: "✅ Upload successful",
      total_rows: sheetData.length,
      inserted_rows: successRows.length,
      failed_rows: failedRows.length,
      success_rows: successRows,
      failed_details: failedRows,
      missing_lans: missingLANs,
      duplicate_utrs: duplicateUTRs,
    });
  } catch (err) {
    console.error("❌ Upload stopped:", err.message);
    res.status(500).json({
      message: "❌ Upload stopped due to error",
      inserted_rows: successRows.length,
      failed_rows: failedRows.length,
      success_rows: successRows,
      failed_details: failedRows,
      missing_lans: missingLANs,
      duplicate_utrs: duplicateUTRs,
      error: err.message,
    });
  }
});

module.exports = router;

