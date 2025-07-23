// // File: backend/routes/forecloserUpload.js    for use FC Upload 


// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const xlsx = require("xlsx");
// const db = require("../config/db");
// const fs = require("fs");

// const upload = multer({ dest: "uploads/" });

// router.post("/upload", upload.single("excel"), async (req, res) => {
//   try {
//     const workbook = xlsx.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);


  

//     for (const row of data) {
//       const { LAN, Foreclosure, Charge_Type } = row;

//       if (Foreclosure === "Yes") {
//         console.log(`⚙️ Calling sp_process_forecloser_charges for LAN: ${LAN}`);
//         await db.promise().query("CALL sp_process_forecloser_charges(?)", [LAN]);
//       }

//       // You can extend to handle Charge_Type = 'Yes' logic separately if needed.
//     }

//     fs.unlinkSync(req.file.path);
//     res.json({ message: "✅ Processed all records" });
//   } catch (err) {
//     console.error("❌ Error uploading file:", err);
//     res.status(500).json({ error: "Failed to process file" });
//   }
// });

// module.exports = router;


// File: backend/routes/forecloserUpload.js    for use FC Upload


// File: backend/routes/forecloserUpload.js    for use FC Upload
// File: backend/routes/forecloserUpload.js    for use FC Upload

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const xlsx = require("xlsx");
// const db = require("../config/db");
// const fs = require("fs");

// const upload = multer({ dest: "uploads/" });

// router.post("/upload", upload.single("excel"), async (req, res) => {
//   try {
//     const workbook = xlsx.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     const insertPromises = data.map(row => {
//       const bankDate = new Date(row["Bank Date"]);
//       const paymentDate = new Date(row["Payment Date"]);
//       const paymentId = row["Payment ID"];
//       const paymentMode = row["Payment Mode"];
//       const transferAmount = parseFloat(row["Transfer Amount"]);

//       // 1. Insert into foreclosure_upload
//       db.promise().query(`
//         INSERT INTO foreclosure_upload (
//           lan, bank_data, utr, payment_date, payment_id,
//           payment_mode, transfer_amount, foreclosure, charge_type,
//           max_waiver_amount, created_at
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
//       `, [
//         row.LAN,
//         bankDate,
//         row.UTR,
//         paymentDate,
//         paymentId,
//         paymentMode,
//         transferAmount,
//         row.Foreclosure,
//         row.Charge_Type,
//         parseFloat(row["Maximum Waiver Amount"])
//       ]);

//       // 2. Insert into repayments_upload
//       db.promise().query(`
//         INSERT INTO repayments_upload (
//           lan, bank_data, utr, payment_date, payment_id,
//           payment_mode, transfer_amount, created_at
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
//       `, [
//         row.LAN,
//         bankDate,
//         row.UTR,
//         paymentDate,
//         paymentId,
//         paymentMode,
//         transferAmount
//       ]);

//       // 3. Call procedures conditionally
//       if (row.Foreclosure === "Yes") {
//         console.log(`⚙️ Calling FC Procs for LAN: ${row.LAN}`);
//         return db.promise().query("CALL sp_calculate_forecloser_collection(?)", [row.LAN])
//           .then(() => db.promise().query("CALL sp_process_forecloser_charges(?, ?, ?, ?, ?, ?)", [
//             row.LAN,
//             bankDate,
//             row.UTR,
//             paymentDate,
//             paymentId,
//             transferAmount
//           ]));
//       }

//       if (row.Charge_Type === "Yes") {
//         console.log(`ℹ️ Custom charge type logic for LAN: ${row.LAN}`);
//         // Optionally implement a separate stored procedure here
//       }

//       return Promise.resolve();
//     });

//     await Promise.all(insertPromises);

//     fs.unlinkSync(req.file.path);
//     res.json({ message: "✅ Upload processed successfully." });

//   } catch (err) {
//     console.error("❌ Error processing upload:", err);
//     res.status(500).json({ error: "Failed to process foreclosure upload." });
//   }
// });

// module.exports = router;
///////////////////////////////////////////////////////

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const xlsx = require("xlsx");
// const db = require("../config/db");
// const fs = require("fs");

// const upload = multer({ dest: "uploads/" });

// // ✅ Helper function to execute MySQL queries using Promises
// const queryDB = (sql, params) => {
//     return new Promise((resolve, reject) => {
//         db.query(sql, params, (err, results) => {
//             if (err) reject(err);
//             else resolve(results);
//         });
//     });
// };

// // ✅ Convert Excel Serial Date to JavaScript Date Object (Handles potential null values)
// const excelSerialToJSDate = (serial) => {
//     if (!serial || isNaN(serial)) return null;
//     const excelEpoch = new Date(Date.UTC(1899, 11, 30));
//     const millisecondsInDay = 24 * 60 * 60 * 1000;
//     return new Date(excelEpoch.getTime() + serial * millisecondsInDay);
// };

// router.post("/upload", upload.single("excel"), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }

//     let processedCount = 0;
//     let missingLANs = [];
//     let duplicatePaymentIDs = [];
//     let uploadData = [];
//     let foreclosureLANs = new Set();

//     try {
//         const workbook = xlsx.readFile(req.file.path);
//         const sheetName = workbook.SheetNames[0];
//         const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//         if (!sheetData || sheetData.length === 0) {
//             return res.status(400).json({ message: "Uploaded Excel file is empty or invalid." });
//         }

//         // ✅ Extract LANs from File
//         const lanValues = sheetData
//             .filter((row) => row["LAN"]) // Ensure "LAN" key exists
//             .map((row) => row["LAN"]);

//         if (lanValues.length === 0) {
//             return res.status(400).json({ message: "No valid LANs found in the file." });
//         }

//         const uniqueLANs = [...new Set(lanValues)]; // Remove duplicates
//         console.log("Extracted LANs:", uniqueLANs);

//         // ✅ Check if LANs exist in loan_bookings (Optional, but good practice)
//         const checkLANQuery = `SELECT lan FROM loan_bookings WHERE lan IN (?)`;
//         let lanResults = await queryDB(checkLANQuery, [uniqueLANs]);
//         const validLANs = new Set(lanResults.map((row) => row.lan));

//         for (let row of sheetData) {
//             console.log("Processing Row:", row); // <--- ADD THIS LINE
//             console.log("Row Keys:", Object.keys(row)); // <--- ADD THIS LINE

//             const lan = row["LAN"];
//             const bankDate = excelSerialToJSDate(row["Bank Date"]);
//             const utr = row["UTR"];
//             const paymentDate = excelSerialToJSDate(row["Payment Date"]);
//             const paymentId = row["Payment ID"];
//             const paymentMode = row["Payment Mode"];
//             const transferAmount = parseFloat(row["Transfer Amount"]);
//             const foreclosure = row["Foreclosure"];
//             const chargeType = row["Charge_Type"];
//             const maxWaiverAmount = parseFloat(row["Maximum Waiver Amount"]);

//             console.log("LAN:", lan);
//             console.log("Payment ID:", paymentId);
//             console.log("Transfer Amount:", transferAmount);

//             if (!lan || !paymentId || isNaN(transferAmount)) {
//                 console.warn("Skipping row due to missing required data (LAN, Payment ID, Transfer Amount):", row);
//                 continue;
//             }

//             // ✅ Check if LAN Exists
//             if (!validLANs.has(lan)) {
//                 missingLANs.push(lan);
//                 continue;
//             }

//             // ✅ Check for Duplicate Payment ID in foreclosure_upload
//             const checkDuplicatePaymentIDQuery = `SELECT COUNT(*) AS count FROM foreclosure_upload WHERE payment_id = ?`;
//             const duplicateIDResults = await queryDB(checkDuplicatePaymentIDQuery, [paymentId]);

//             if (
//                 Array.isArray(duplicateIDResults) &&
//                 duplicateIDResults.length > 0 &&
//                 duplicateIDResults[0].count > 0
//             ) {
//                 duplicatePaymentIDs.push(paymentId);
//                 continue;
//             }

//             // ✅ Prepare Data for Bulk Insert into foreclosure_upload
//             uploadData.push([
//                 lan,
//                 bankDate ? bankDate.toISOString().split('T')[0] : null,
//                 utr,
//                 paymentDate ? paymentDate.toISOString().split('T')[0] : null,
//                 paymentId,
//                 paymentMode,
//                 isNaN(transferAmount) ? 0 : transferAmount,
//                 foreclosure,
//                 chargeType,
//                 isNaN(maxWaiverAmount) ? 0 : maxWaiverAmount,
//                 new Date()
//             ]);

//             if (foreclosure === "Yes") {
//                 foreclosureLANs.add(lan);
//             }

//             processedCount++;
//         }

//         // ✅ Bulk Insert into foreclosure_upload
//         if (uploadData.length > 0) {
//             const insertQuery = `
//                 INSERT INTO foreclosure_upload (
//                     lan, bank_data, utr, payment_date, payment_id,
//                     payment_mode, transfer_amount, foreclosure, charge_type,
//                     max_waiver_amount, created_at
//                 ) VALUES ?;
//             `;
//             await queryDB(insertQuery, [uploadData]);
//             console.log(`✅ Bulk inserted ${uploadData.length} records into foreclosure_upload.`);
//         }

//         // ✅ Process Foreclosure Cases
//         for (const lan of foreclosureLANs) {
//             console.log(`⚙️ Processing Foreclosure for LAN: ${lan}`);
//             try {
//                 await queryDB("CALL sp_calculate_forecloser_collection(?)", [lan]);

//                 // Fetch relevant data for sp_process_forecloser_charges
//                 const foreclosureDataQuery = `
//                     SELECT bank_data, utr, payment_date, payment_id, payment_mode, transfer_amount
//                     FROM foreclosure_upload
//                     WHERE lan = ? AND foreclosure = 'Yes'
//                     ORDER BY created_at DESC
//                     LIMIT 1;
//                 `;
//                 const foreclosureDataResults = await queryDB(foreclosureDataQuery, [lan]);

//                 if (foreclosureDataResults && foreclosureDataResults.length > 0) {
//                     const fcData = foreclosureDataResults[0];
//                     await queryDB("CALL sp_process_forecloser_charges(?, ?, ?, ?, ?, ?, ?)", [
//                         lan,
//                         fcData.payment_id,
//                         fcData.utr,
//                         fcData.payment_mode,
//                         fcData.transfer_amount,
//                         fcData.payment_date ? fcData.payment_date.toISOString().split('T')[0] : null,
//                         fcData.bank_data ? fcData.bank_data.toISOString().split('T')[0] : null,
//                     ]);
//                     console.log(`✅ sp_calculate_forecloser_collection and sp_process_forecloser_charges completed for LAN: ${lan}`);
//                 } else {
//                     console.warn(`⚠️ No foreclosure data found in foreclosure_upload for LAN: ${lan} to call sp_process_forecloser_charges.`);
//                 }
//             } catch (error) {
//                 console.error(`❌ Error processing foreclosure for LAN ${lan}:`, error);
//             }
//         }

//         res.json({
//             message: `✅ Foreclosure upload processed. ${processedCount} records processed.`,
//             missing_lans: missingLANs,
//             duplicate_payment_ids: duplicatePaymentIDs,
//         });
//     } catch (error) {
//         console.error("❌ Error processing foreclosure upload:", error);
//         res.status(500).json({ error: "Failed to process foreclosure upload." });
//     } finally {
//         if (req.file && req.file.path) {
//             fs.unlinkSync(req.file.path); // Clean up uploaded file
//         }
//     }
// });

// module.exports = router;

/////////////////////////////////////////////////////////////

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const xlsx = require("xlsx");
// const db = require("../config/db");
// const fs = require("fs");

// const upload = multer({ dest: "uploads/" });

// // ✅ Helper function to execute MySQL queries using Promises
// const queryDB = (sql, params) => {
//     return new Promise((resolve, reject) => {
//         db.query(sql, params, (err, results) => {
//             if (err) reject(err);
//             else resolve(results);
//         });
//     });
// };

// // ✅ Convert Excel Serial Date to JavaScript Date Object (Handles potential null values)
// const excelSerialToJSDate = (serial) => {
//     if (!serial || isNaN(serial)) return null;
//     const excelEpoch = new Date(Date.UTC(1899, 11, 30));
//     const millisecondsInDay = 24 * 60 * 60 * 1000;
//     return new Date(excelEpoch.getTime() + serial * millisecondsInDay);
// };

// router.post("/upload", upload.single("excel"), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }

//     let processedCount = 0;
//     let missingLANs = [];
//     let duplicatePaymentIDs = [];
//     let uploadData = [];
//     let repaymentData = [];
//     let foreclosureLANs = new Set();

//     try {
//         const workbook = xlsx.readFile(req.file.path);
//         const sheetName = workbook.SheetNames[0];
//         const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//         if (!sheetData || sheetData.length === 0) {
//             return res.status(400).json({ message: "Uploaded Excel file is empty or invalid." });
//         }

//         // ✅ Extract LANs from File
//         const lanValues = sheetData
//             .filter((row) => row["LAN"]) // Ensure "LAN" key exists
//             .map((row) => row["LAN"]);

//         if (lanValues.length === 0) {
//             return res.status(400).json({ message: "No valid LANs found in the file." });
//         }

//         const uniqueLANs = [...new Set(lanValues)]; // Remove duplicates
//         console.log("Extracted LANs:", uniqueLANs);

//         // ✅ Check if LANs exist in loan_bookings (Optional, but good practice)
//         const checkLANQuery = `SELECT lan FROM loan_bookings WHERE lan IN (?)`;
//         let lanResults = await queryDB(checkLANQuery, [uniqueLANs]);
//         const validLANs = new Set(lanResults.map((row) => row.lan));

//         for (let row of sheetData) {
//             console.log("Processing Row:", row); // <--- ADD THIS LINE
//             console.log("Row Keys:", Object.keys(row)); // <--- ADD THIS LINE

//             const lan = row["LAN"];
//             const bankDate = excelSerialToJSDate(row["Bank Date"]);
//             const utr = row["UTR"];
//             const paymentDate = excelSerialToJSDate(row["Payment Date"]);
//             const paymentId = row["Payment ID"];
//             const paymentMode = row["Payment Mode"];
//             const transferAmount = parseFloat(row["Transfer Amount"]);
//             const foreclosure = row["Foreclosure"];

//             console.log("LAN:", lan);
//             console.log("Payment ID:", paymentId);
//             console.log("Transfer Amount:", transferAmount);

//             if (!lan || !paymentId || isNaN(transferAmount)) {
//                 console.warn("Skipping row due to missing required data (LAN, Payment ID, Transfer Amount):", row);
//                 continue;
//             }

//             // ✅ Check if LAN Exists
//             if (!validLANs.has(lan)) {
//                 missingLANs.push(lan);
//                 continue;
//             }

//             // ✅ Check for Duplicate Payment ID in repayments_upload (assuming this is the target for all uploads)
//             const checkDuplicatePaymentIDQuery = `SELECT COUNT(*) AS count FROM repayments_upload WHERE payment_id = ?`;
//             const duplicateIDResults = await queryDB(checkDuplicatePaymentIDQuery, [paymentId]);

//             if (
//                 Array.isArray(duplicateIDResults) &&
//                 duplicateIDResults.length > 0 &&
//                 duplicateIDResults[0].count > 0
//             ) {
//                 duplicatePaymentIDs.push(paymentId);
//                 continue;
//             }

//             // ✅ Prepare Data for Bulk Insert into repayments_upload
//             repaymentData.push([
//                 lan,
//                 bankDate ? bankDate.toISOString().split('T')[0] : null,
//                 utr,
//                 paymentDate ? paymentDate.toISOString().split('T')[0] : null,
//                 paymentId,
//                 paymentMode,
//                 isNaN(transferAmount) ? 0 : transferAmount,
//                 new Date()
//             ]);

//             // ✅ Prepare Data for Bulk Insert into foreclosure_upload (if foreclosure is 'Yes')
//             if (foreclosure === "Yes") {
//                 const chargeType = row["Charge_Type"]; // Assuming these columns exist for foreclosure
//                 const maxWaiverAmount = parseFloat(row["Maximum Waiver Amount"]);
//                 uploadData.push([
//                     lan,
//                     bankDate ? bankDate.toISOString().split('T')[0] : null,
//                     utr,
//                     paymentDate ? paymentDate.toISOString().split('T')[0] : null,
//                     paymentId,
//                     paymentMode,
//                     isNaN(transferAmount) ? 0 : transferAmount,
//                     foreclosure,
//                     chargeType,
//                     isNaN(maxWaiverAmount) ? 0 : maxWaiverAmount,
//                     new Date()
//                 ]);
//                 foreclosureLANs.add(lan);
//             }

//             processedCount++;
//         }

//         // ✅ Bulk Insert into repayments_upload
//         if (repaymentData.length > 0) {
//             const insertRepaymentQuery = `
//                 INSERT INTO repayments_upload (
//                     lan, bank_data, utr, payment_date, payment_id,
//                     payment_mode, transfer_amount, created_at
//                 ) VALUES ?;
//             `;
//             await queryDB(insertRepaymentQuery, [repaymentData]);
//             console.log(`✅ Bulk inserted ${repaymentData.length} records into repayments_upload.`);
//         }

//         // ✅ Bulk Insert into foreclosure_upload (only if there's foreclosure data)
//         if (uploadData.length > 0) {
//             const insertForeclosureQuery = `
//                 INSERT INTO foreclosure_upload (
//                     lan, bank_data, utr, payment_date, payment_id,
//                     payment_mode, transfer_amount, foreclosure, charge_type,
//                     max_waiver_amount, created_at
//                 ) VALUES ?;
//             `;
//             await queryDB(insertForeclosureQuery, [uploadData]);
//             console.log(`✅ Bulk inserted ${uploadData.length} records into foreclosure_upload.`);
//         }

//         // ✅ Process Foreclosure Cases
//         for (const lan of foreclosureLANs) {
//             console.log(`⚙️ Processing Foreclosure for LAN: ${lan}`);
//             try {
//                 await queryDB("CALL sp_calculate_forecloser_collection(?)", [lan]);

//                 // Fetch relevant data for sp_process_forecloser_charges from repayments_upload
//                 const repaymentDataQuery = `
//                     SELECT bank_data, utr, payment_date, payment_id, payment_mode, transfer_amount
//                     FROM repayments_upload
//                     WHERE lan = ?
//                     ORDER BY created_at DESC
//                     LIMIT 1;
//                 `;
//                 const repaymentDataResults = await queryDB(repaymentDataQuery, [lan]);

//                 if (repaymentDataResults && repaymentDataResults.length > 0) {
//                     const rpData = repaymentDataResults[0];
//                     await queryDB("CALL sp_process_forecloser_charges(?, ?, ?, ?, ?, ?, ?)", [
//                         lan,
//                         rpData.payment_id,
//                         rpData.utr,
//                         rpData.payment_mode,
//                         rpData.transfer_amount,
//                         rpData.payment_date ? rpData.payment_date.toISOString().split('T')[0] : null,
//                         rpData.bank_data ? rpData.bank_data.toISOString().split('T')[0] : null,
//                     ]);
//                     console.log(`✅ sp_calculate_forecloser_collection and sp_process_forecloser_charges completed for LAN: ${lan}`);
//                 } else {
//                     console.warn(`⚠️ No repayment data found for LAN: ${lan} to call sp_process_forecloser_charges.`);
//                 }
//             } catch (error) {
//                 console.error(`❌ Error processing foreclosure for LAN ${lan}:`, error);
//             }
//         }

//         res.json({
//             message: `✅ Upload processed. ${processedCount} records processed.`,
//             missing_lans: missingLANs,
//             duplicate_payment_ids: duplicatePaymentIDs,
//         });
//     } catch (error) {
//         console.error("❌ Error processing upload:", error);
//         res.status(500).json({ error: "Failed to process upload." });
//     } finally {
//         if (req.file && req.file.path) {
//             fs.unlinkSync(req.file.path); // Clean up uploaded file
//         }
//     }
// });

// module.exports = router;


/////////////////////

const express = require("express");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const db = require("../config/db");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

// Convert Excel serial date to JS date
const excelSerialToJSDate = (serial) => {
  if (!serial || isNaN(serial)) return null;
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000); // ms/day
};

// Main upload route
router.post("/upload", upload.single("excel"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const foreclosureLANs = [];

    const uploadData = [];

    for (const row of sheet) {
      const lan = row["LAN"];
      const bankDate = excelSerialToJSDate(row["Bank Date"]);
      const paymentDate = excelSerialToJSDate(row["Payment Date"]);
      const paymentId = row["Payment ID"] || row["Payment Id"];
      const utr = row["UTR"];
      const paymentMode = row["Payment Mode"];
      const transferAmount = parseFloat(row["Transfer Amount"]);
      const foreclosure = row["Foreclosure"];
      const chargeType = row["Charge Type"] || row["Charge_Type"];
      const maxWaiver = parseFloat(row["Maximum Waiver Amount"]);

      if (!lan || !paymentId || isNaN(transferAmount)) {
        console.warn("⚠️ Skipping row due to missing required fields:", row);
        continue;
      }

      // Save to foreclosure_upload
      await db.promise().query(`
        INSERT INTO foreclosure_upload (
          lan, bank_data, utr, payment_date, payment_id,
          payment_mode, transfer_amount, foreclosure, charge_type,
          max_waiver_amount, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [lan, bankDate, utr, paymentDate, paymentId, paymentMode, transferAmount, foreclosure, chargeType, maxWaiver]);

      // Save to repayments_upload
      await db.promise().query(`
        INSERT INTO repayments_upload (
          lan, bank_data, utr, payment_date, payment_id,
          payment_mode, transfer_amount, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `, [lan, bankDate, utr, paymentDate, paymentId, paymentMode, transferAmount]);

      // Call procs if Foreclosure = Yes
      if (foreclosure === "Yes") {
        console.log(`🔁 Processing LAN: ${lan}`);
        await db.promise().query("CALL sp_calculate_forecloser_collection(?)", [lan]);
        await db.promise().query("CALL sp_process_forecloser_charges(?, ?, ?, ?, ?, ?, ?)", [
          lan, paymentId, utr, paymentMode, transferAmount, paymentDate, bankDate
        ]);
      }
    }

    fs.unlinkSync(req.file.path);
    res.json({ message: "✅ Upload and processing completed." });

  } catch (error) {
    console.error("❌ Upload failed:", error);
    res.status(500).json({ error: "Failed to process foreclosure file." });
  }
});

module.exports = router;
