// const express = require("express");
// const multer = require("multer");
// const xlsx = require("xlsx");
// const db = require("../config/db");

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// // ✅ Helper function to execute MySQL queries using Promises
// const queryDB = async (sql, params) => {
//     try {
//         const [rows] = await db.promise().query(sql, params);
//         return Array.isArray(rows) ? rows : []; 
//     } catch (error) {
//         console.error("❌ MySQL Query Error:", error);
//         return [];
//     }
// };

// // ✅ Convert Excel Serial Date to MySQL Date Format (YYYY-MM-DD)
// const excelSerialToDate = (value) => {
//     if (!value) return null;
//     if (!isNaN(value)) {
//         const excelEpoch = new Date(Date.UTC(1899, 11, 30));
//         let correctDate = new Date(excelEpoch.getTime() + value * 86400000);
//         return correctDate.toISOString().split("T")[0];
//     }
//     return null;
// };

// // ✅ API to Upload Delete Cashflow Excel
// router.post("/upload-delete-cashflow", upload.single("file"), async (req, res) => {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     try {
//         const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//         const sheetName = workbook.SheetNames[0];
//         const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//         if (!sheetData || sheetData.length === 0) {
//             return res.status(400).json({ message: "Uploaded Excel file is empty or invalid." });
//         }

//         for (const row of sheetData) {
//             const lan = row["LAN"];
//             const paymentDate = excelSerialToDate(row["Payment Date"]);
//             const paymentId = row["Payment Id"];
//             const transferAmount = row["Transfer Amount"];
//             const reasonForDeletion = row["Reason for Deletion"];

//             console.log(`🔍 Checking for LAN: ${lan}, Payment ID: ${paymentId}, Payment Date: ${paymentDate}`);

//             // ✅ Check if the repayment exists
//             const existingRecords = await queryDB(
//                 "SELECT id FROM repayments_upload WHERE lan = ? AND payment_id = ? AND payment_date = ?",
//                 [lan, paymentId, paymentDate]
//             );

//             if (existingRecords.length === 0) {
//                 console.log(`❌ No record found for LAN: ${lan}, Payment ID: ${paymentId}`);
//                 continue;
//             }

//             // ✅ Backup before deletion
//             await queryDB(
//                 `INSERT INTO deleted_cashflow_backup (lan, payment_id, payment_date, transfer_amount, reason, created_at)
//                  SELECT lan, payment_id, payment_date, transfer_amount, ?, NOW()
//                  FROM repayments_upload
//                  WHERE lan = ? AND payment_id = ? AND payment_date = ?`,
//                 [reasonForDeletion, lan, paymentId, paymentDate]
//             );

//             console.log(`🔄 Backup created for LAN: ${lan}, Payment ID: ${paymentId}`);

//             // ✅ Call Stored Procedure for Reversal with Debug Logs
//             try {
//                 console.log(`🔄 Reversing RPS for LAN: ${lan}, Payment ID: ${paymentId}`);

//                 await queryDB("CALL sp_reverse_repayment_schedule(?, ?, ?)", [
//                     lan,
//                     transferAmount,
//                     paymentDate
//                 ]);

//                 console.log(`✅ RPS Reversal Completed for LAN: ${lan}, Payment ID: ${paymentId}`);

//                 // ✅ Delete from `repayments_upload` after successful reversal
//                 await queryDB(
//                     "DELETE FROM repayments_upload WHERE lan = ? AND payment_id = ? AND payment_date = ?",
//                     [lan, paymentId, paymentDate]
//                 );

//                 console.log(`🗑️ Deleted record for LAN: ${lan}, Payment ID: ${paymentId}`);
//             } catch (error) {
//                 console.error(`❌ Error in RPS Reversal for LAN: ${lan}, Payment ID: ${paymentId}`, error);
//             }
//         }

//         res.json({ message: "Delete Cashflow file processed successfully" });

//     } catch (error) {
//         console.error("❌ Error processing file:", error);
//         res.status(500).json({ message: "Error processing file" });
//     }
// });

// module.exports = router;
///////////////////////////        Working Code  //////////////////////

// const express = require("express");
// const multer = require("multer");
// const xlsx = require("xlsx");
// const db = require("../config/db");

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// const queryDB = async (sql, params) => {
//     try {
//       const [rows] = await db.promise().query(sql, params);
//       return Array.isArray(rows) ? rows : [];
//     } catch (error) {
//       console.error("❌ MySQL Query Error:", error);
//       return [];
//     }
// };

// // ✅ API to Upload Delete Cashflow Excel
// router.post("/upload-delete-cashflow", upload.single("file"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//   try {
//     const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     if (!sheetData || sheetData.length === 0) {
//       return res.status(400).json({ message: "Uploaded Excel file is empty or invalid." });
//     }

//     for (const row of sheetData) {
//       const lan = row["LAN"];
//       const paymentDate = row["Payment Date"];
//       const paymentId = row["Payment Id"];
//       const transferAmount = row["Transfer Amount"];
//       const reasonForDeletion = row["Reason for Deletion"];

//       console.log(`🔍 Checking for LAN: ${lan}, Payment ID: ${paymentId}, Payment Date: ${paymentDate}`);

//       // ✅ Fetch available repayments from the database for the LAN
//       const existingRecords = await queryDB(
//         "SELECT id, lan, payment_id, payment_date, transfer_amount FROM repayments_upload WHERE lan = ?",
//         [lan]
//       );

//       // ✅ Check if the current record exists in repayments_upload
//       const matchedRecord = existingRecords.find(record => 
//         record.payment_id === paymentId &&
//         record.payment_date === paymentDate &&
//         record.transfer_amount === transferAmount
//       );

//       if (!matchedRecord) {
//         //console.log(`⚠️ No matching record found for LAN: ${lan}, Payment ID: ${paymentId}, Transfer Amount: ${transferAmount}`);
        
//         res.json({ message: `Check Cashflow and Payment date Alreday Future Cashflow Present  LAN: ${lan}` });
//         continue;
//       }

//       console.log(`✅ Record Found! Proceeding with deletion.`);

//       // ✅ Backup the record before deleting
//       await queryDB(
//         `INSERT INTO deleted_cashflow_backup (lan, payment_id, payment_date, transfer_amount, reason, created_at)
//          SELECT lan, payment_id, payment_date, transfer_amount, ?, NOW()
//          FROM repayments_upload
//          WHERE id = ?`,
//         [reasonForDeletion, matchedRecord.id]
//       );

//       console.log(`🔄 Backup created for LAN: ${lan}, Payment ID: ${paymentId}`);

//       // ✅ Delete only the matched record from `repayments_upload`
//       await queryDB(
//         "DELETE FROM repayments_upload WHERE id = ?",
//         [matchedRecord.id]
//       );

//       console.log(`🗑️ Deleted record for LAN: ${lan}, Payment ID: ${paymentId}`);

//       // ✅ Call the stored procedure to reverse the repayment
//       try {
//         console.log(`🔄 Reversing RPS for LAN: ${lan}, Payment ID: ${paymentId}`);
    
//         await queryDB("CALL sp_reverse_repayment_schedule(?, ?, ?)", [
//             lan,
//             transferAmount,
//             paymentDate
//         ]);
    
//         console.log(`✅ RPS Reversal Completed for LAN: ${lan}, Payment ID: ${paymentId}`);
//       } catch (error) {
//         console.error(`❌ Error in RPS Reversal for LAN: ${lan}, Payment ID: ${paymentId}`, error);
//       }
//     }

//     res.json({ message: "Delete Cashflow file processed successfully" });

//   } catch (error) {
//     console.error("❌ Error processing file:", error);
//     res.status(500).json({ message: "Error processing file" });
//   }
// });

// module.exports = router;



//////////////////////////////////////////////
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const db = require("../config/db");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const excelDateToJSDate = (value) => {
    if (!value) return null;
  
    if (!isNaN(value)) {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel base date (UTC)
  
      let correctDate = new Date(excelEpoch.getTime() + value * 86400000);
  
      return correctDate.toISOString().split("T")[0]; // Return YYYY-MM-DD (no time manipulation)
    }
  
    // ✅ Case 2: Handle Text Date (e.g., "10-Mar-24")
  
    if (typeof value === "string" && value.match(/^\d{2}-[A-Za-z]{3}-\d{2}$/)) {
      const [day, monthAbbr, yearShort] = value.split("-");
  
      const monthNames = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };
  
      const month = monthNames[monthAbbr];
  
      if (month === undefined) return null;
  
      const year = parseInt("20" + yearShort, 10);
  
      return new Date(Date.UTC(parseInt(day, 10), month, year))
  
        .toISOString()
  
        .split("T")[0];
    }
  
    return null;
  };

const queryDB = async (sql, params) => {
  try {
    const [rows] = await db.promise().query(sql, params);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("❌ MySQL Query Error:", error);
    return [];
  }
};

// ✅ Function to Normalize Payment ID
const normalizePaymentId = (id) => id ? id.trim().toLowerCase() : "";

// ✅ API to Upload Delete Cashflow Excel
router.post("/upload-delete-cashflow", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData || sheetData.length === 0) {
      return res.status(400).json({ message: "Uploaded Excel file is empty or invalid." });
    }

    for (const row of sheetData) {
      const lan = row["LAN"];
      const paymentDate =  row["Payment Date"] ? excelDateToJSDate(row["Payment Date"]) : null;
      const paymentId = normalizePaymentId(row["Payment Id"]);
      const transferAmount = parseFloat(row["Transfer Amount"]) || 0; // Ensure it's a valid number
      const reasonForDeletion = row["Reason for Deletion"];

      console.log(`🔍 Checking for LAN: ${lan}, Payment ID: ${paymentId}, Payment Date: ${paymentDate}, Amount: ${transferAmount}`);

      // ✅ Fetch available repayments for the given LAN in DESCENDING ORDER
      const existingRecords = await queryDB(
        `SELECT id, lan, LOWER(TRIM(payment_id)) AS payment_id, DATE(payment_date) AS payment_date, ROUND(transfer_amount, 2) AS transfer_amount 
         FROM repayments_upload WHERE lan = ? ORDER BY payment_date DESC`,
        [lan]
      );

      if (!existingRecords || existingRecords.length === 0) {
        console.log(`⚠️ No records found in repayments_upload for LAN: ${lan}`);
        continue;
      }

      console.log(`🔎 Found ${existingRecords.length} payment records. Checking for match...`);

      // ✅ Find the record with the matching Payment ID, Amount, and Payment Date
      const matchedRecord = existingRecords.find(record =>
        record.payment_id === paymentId &&
       // record.payment_date === paymentDate &&
        Math.abs(record.transfer_amount - transferAmount) < 0.01 // Handles minor rounding issues
      );

      if (!matchedRecord) {
        console.log(`⚠️ No exact matching record found for LAN: ${lan}, Payment ID: ${paymentId}, Amount: ${transferAmount}`);
        continue; // Skip to next record
      }

      console.log(`✅ Record Found! Proceeding with deletion.`);

      // ✅ Backup the record before deletion
      await queryDB(
        `INSERT INTO deleted_cashflow_backup (lan, payment_id, payment_date, transfer_amount, reason, created_at)
         SELECT lan, payment_id, payment_date, transfer_amount, ?, NOW()
         FROM repayments_upload
         WHERE id = ?`,
        [reasonForDeletion, matchedRecord.id]
      );

      console.log(`🔄 Backup created for LAN: ${lan}, Payment ID: ${paymentId}`);

      // ✅ Delete only the matched record from `repayments_upload`
      await queryDB("DELETE FROM repayments_upload WHERE id = ?", [matchedRecord.id]);

      console.log(`🗑️ Deleted record for LAN: ${lan}, Payment ID: ${paymentId}`);

      // ✅ Call the stored procedure to reverse the repayment
      try {
        console.log(`🔄 Reversing RPS for LAN: ${lan}, Payment ID: ${paymentId}`);

        await queryDB("CALL sp_reverse_repayment_schedule(?, ?, ?)", [
          lan,
          transferAmount,
          paymentDate
        ]);

        console.log(`✅ RPS Reversal Completed for LAN: ${lan}, Payment ID: ${paymentId}`);
      } catch (error) {
        console.error(`❌ Error in RPS Reversal for LAN: ${lan}, Payment ID: ${paymentId}`, error);
      }
    }

    res.json({ message: "Delete Cashflow file processed successfully" });

  } catch (error) {
    console.error("❌ Error processing file:", error);
    res.status(500).json({ message: "Error processing file" });
  }
});

module.exports = router;
