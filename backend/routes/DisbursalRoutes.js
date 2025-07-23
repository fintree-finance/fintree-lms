// const express = require("express");
// const db = require("../config/db");
// const router = express.Router();

// // ✅ Fetch Disbursal Details by LAN
// router.get("/:lan", (req, res) => {
//   const { lan } = req.params;

//   console.log("🔍 Received request for LAN:", lan);

//   // Step 1: Validate LAN
//   if (!lan || lan.trim() === "") {
//     console.warn("⚠️ Invalid or empty LAN received");
//     return res.status(400).json({ error: "LAN is required and cannot be empty" });
//   }

//   // Step 2: Determine table and columns
//   let tableName = "loan_bookings";
//   let loanAmountCol = "lb.loan_amount";
//   let loanAmountExpr = "lb.loan_amount";
//   let interestRateCol = "lb.interest_rate";
//   let tenureCol = "lb.loan_tenure";
//   let processingFeeCol = "COALESCE(lb.processing_fee, 0) AS processing_fee";
//   let subventionCol = "0";

//   if (lan.startsWith("GQN")) {
//     tableName = "loan_booking_gq_non_fsf";
//     loanAmountCol = "lb.loan_amount_sanctioned AS loan_amount";
//     loanAmountExpr = "lb.loan_amount_sanctioned";
//     interestRateCol = "lb.interest_percent AS interest_rate";
//     tenureCol = "lb.loan_tenure_months AS loan_tenure";
//     processingFeeCol = "NULL AS processing_fee";
//     subventionCol = "COALESCE(lb.subvention_amount, 0)";
//   } else if (lan.startsWith("ADK")) {
//     tableName = "loan_booking_adikosh";
//     loanAmountCol = "lb.loan_amount";
//     loanAmountExpr = "lb.loan_amount";
//     interestRateCol = "lb.interest_rate";
//     tenureCol = "lb.loan_tenure";
//     processingFeeCol = "NULL AS processing_fee";
//     subventionCol = "0"; // If you add subvention in adikosh table, update this
//   }else if (lan.startsWith("GQF")) {
//     tableName = "loan_bookings_gq_fsf";
//     loanAmountCol = "lb.loan_amount_sanctioned AS loan_amount";
//     loanAmountExpr = "lb.loan_amount_sanctioned";
//     interestRateCol = "lb.interest_percent AS interest_rate";
//     tenureCol = "lb.loan_tenure_months AS loan_tenure";
//     processingFeeCol = "NULL AS processing_fee";
//     subventionCol = "COALESCE(lb.subvention_amount, 0)";
//   }

//   console.log(`📦 Using table: ${tableName} for LAN: ${lan}`);

//   // Step 3: Build Query
//   const query = `
//   SELECT 
//     ${loanAmountCol},
//     lb.partner_loan_id,
//     ${processingFeeCol},
//     ${interestRateCol},
//     ${tenureCol},
//     COALESCE(lb.agreement_date, '0000-00-00') AS agreement_date,
//     COALESCE(NULLIF(ed.Disbursement_UTR, ''), 'Missing UTR') AS disbursement_utr,
//     COALESCE(ed.disbursement_date, '0000-00-00') AS disbursement_date,
//     (${loanAmountExpr} - ${subventionCol}) AS net_disbursement
//   FROM ${tableName} lb
//   LEFT JOIN ev_disbursement_utr ed 
//     ON lb.lan COLLATE utf8mb4_general_ci = ed.lan COLLATE utf8mb4_general_ci
//   WHERE lb.lan = ?;
// `;


//   console.log("📄 SQL Query Prepared.");

//   // Step 4: Execute Query
//   db.query(query, [lan], (err, result) => {
//     if (err) {
//       console.error("❌ Database query error:", err);
//       return res.status(500).json({ error: "Database query failed" });
//     }

//     console.log("✅ Query executed successfully.");

//     if (result.length === 0) {
//       console.warn(`⚠️ No disbursal details found for LAN: ${lan}`);
//       return res.status(404).json({ error: `No disbursal details found for LAN: ${lan}` });
//     }

//     console.log("📦 Disbursal details fetched:", result[0]);
//     res.json(result[0]);
//   });
// });

// module.exports = router;





const express = require("express");
const db = require("../config/db");
const router = express.Router();

// ✅ Fetch Disbursal Details by LAN
router.get("/:lan", (req, res) => {
  const { lan } = req.params;

  console.log("🔍 Received request for LAN:", lan);

  // Step 1: Validate LAN
  if (!lan || lan.trim() === "") {
    console.warn("⚠️ Invalid or empty LAN received");
    return res.status(400).json({ error: "LAN is required and cannot be empty" });
  }

  // Step 2: Determine table and columns
  let tableName = "loan_bookings";
  let loanAmountCol = "lb.loan_amount";
  let loanAmountExpr = "lb.loan_amount";
  let interestRateCol = "lb.interest_rate";
  let tenureCol = "lb.loan_tenure";
  let processingFeeCol = "COALESCE(lb.processing_fee, 0) AS processing_fee";
  let subventionCol = "0";
  let retentionCol = "0"; // Default to 0 for non-GQF
  let netDisbursementExpr = `(${loanAmountExpr} - ${subventionCol})`;

  if (lan.startsWith("GQN")) {
    tableName = "loan_booking_gq_non_fsf";
    loanAmountCol = "lb.loan_amount_sanctioned AS loan_amount";
    loanAmountExpr = "lb.loan_amount_sanctioned";
    interestRateCol = "lb.interest_percent AS interest_rate";
    tenureCol = "lb.loan_tenure_months AS loan_tenure";
    processingFeeCol = "NULL AS processing_fee";
    subventionCol = "COALESCE(lb.subvention_amount, 0)";
    netDisbursementExpr = `(${loanAmountExpr} - ${subventionCol})`;
  }
  else if (lan.startsWith("WCTL")) {
    tableName = "loan_bookings_wctl";
    posTable = "manual_rps_wctl";
    loanAmountCol = "lb.loan_amount";
    loanAmountExpr = "lb.loan_amount";
    interestRateCol = "lb.interest_rate";
    tenureCol = "lb.loan_tenure";
    processingFeeCol = "NULL AS processing_fee";
    subventionCol = "0";
    netDisbursementExpr = `(${loanAmountExpr})`;
  } else if (lan.startsWith("ADK")) {
    tableName = "loan_booking_adikosh";
    loanAmountCol = "lb.loan_amount";
    loanAmountExpr = "lb.loan_amount";
    interestRateCol = "lb.interest_rate";
    tenureCol = "lb.loan_tenure";
    processingFeeCol = "NULL AS processing_fee";
    subventionCol = "0";
    netDisbursementExpr = `(${loanAmountExpr})`; // No subvention or retention
  } else if (lan.startsWith("GQF")) {
    tableName = "loan_booking_gq_fsf";
    loanAmountCol = "lb.loan_amount_sanctioned AS loan_amount";
    loanAmountExpr = "lb.loan_amount_sanctioned";
    interestRateCol = "lb.interest_percent AS interest_rate";
    tenureCol = "lb.loan_tenure_months AS loan_tenure";
    processingFeeCol = "NULL AS processing_fee";
    subventionCol = "COALESCE(lb.subvention_amount, 0)";
    retentionCol = "COALESCE(lb.retention_amount, 0)";
    netDisbursementExpr = `(${loanAmountExpr} - ${subventionCol} - ${retentionCol})`;
  }

  console.log(`📦 Using table: ${tableName} for LAN: ${lan}`);

  // Step 3: Build Query
  const query = `
    SELECT 
      ${loanAmountCol},
      lb.partner_loan_id,
      ${processingFeeCol},
      ${interestRateCol} ,
      ${tenureCol},
      COALESCE(lb.agreement_date, '0000-00-00') AS agreement_date,
      COALESCE(NULLIF(ed.Disbursement_UTR, ''), 'Missing UTR') AS disbursement_utr,
      COALESCE(ed.disbursement_date, '0000-00-00') AS disbursement_date,
      ${netDisbursementExpr} AS net_disbursement
    FROM ${tableName} lb
    LEFT JOIN ev_disbursement_utr ed 
      ON lb.lan COLLATE utf8mb4_general_ci = ed.lan COLLATE utf8mb4_general_ci
    WHERE lb.lan = ?;
  `;

  console.log("📄 SQL Query Prepared.");

  // Step 4: Execute Query
  db.query(query, [lan], (err, result) => {
    if (err) {
      console.error("❌ Database query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    console.log("✅ Query executed successfully.");

    if (result.length === 0) {
      console.warn(`⚠️ No disbursal details found for LAN: ${lan}`);
      return res.status(404).json({ error: `No disbursal details found for LAN: ${lan}` });
    }

    console.log("📦 Disbursal details fetched:", result[0]);
    res.json(result[0]);
  });
});

module.exports = router;
