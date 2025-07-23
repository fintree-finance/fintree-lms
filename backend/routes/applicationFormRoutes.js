const express = require("express");
const db = require("../config/db");
const {verifyApiKey} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:lan", (req, res) => {
  const { lan } = req.params;
  let table = "";

  if (lan.startsWith("EV") || lan.startsWith("HC") || lan.startsWith("BL")) {
    table = "loan_bookings";
  } else if (lan.startsWith("GQN")) {
    table = "loan_bookings_gq_fsf";
  } else if (lan.startsWith("AD")) {
    table = "loan_bookings_adikosh";
  } else {
    return res.status(404).json({ message: "Invalid LAN" });
  }

  const loanQuery = `SELECT * FROM ${table} WHERE lan = ?`;
  const docQuery = `SELECT id, file_name, original_name FROM loan_documents WHERE lan = ?`;

  // Fetch loan and documents in parallel
  db.query(loanQuery, [lan], (loanErr, loanResults) => {
    if (loanErr) {
      console.error("Error fetching loan details:", loanErr);
      return res.status(500).json({ message: "Database error" });
    }

    if (loanResults.length === 0) {
      return res.status(404).json({ message: "Loan not found or not disbursed" });
    }

    const loanData = loanResults[0];

    // Now fetch documents
    db.query(docQuery, [lan], (docErr, docResults) => {
      if (docErr) {
        console.error("Error fetching loan documents:", docErr);
        return res.status(500).json({ message: "Document fetch error" });
      }

      return res.json({
        loan: loanData,
        documents: docResults,
      });
    });
  });
});

module.exports = router;
