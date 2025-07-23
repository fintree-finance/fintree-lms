const express = require("express");
const db = require("../config/db");
const router = express.Router();

// ✅ Get Charges & Cashflow Data for a Specific LAN
router.get("/charges-cashflow/:lan", async (req, res) => {
    const { lan } = req.params;

    try {
        const isAdikosh = lan.startsWith("ADK");
        const tableName = isAdikosh ? "repayments_upload_adikosh" : "repayments_upload";

        const query = `
            SELECT 
                lan, 
                bank_date, 
                utr, 
                payment_date, 
                payment_id, 
                payment_mode, 
                transfer_amount, 
                created_at 
            FROM ${tableName}
            WHERE lan = ?
            ORDER BY created_at ASC;
        `;

        db.query(query, [lan], (err, results) => {
            if (err) {
                console.error("⚠️ Error fetching charges cashflow:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.json(results);
        });
    } catch (error) {
        console.error("⚠️ Unexpected error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
