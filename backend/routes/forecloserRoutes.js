const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/fc/:lan", async (req, res) => {
  const lan = req.params.lan;
  try {
    console.log("🧮 Running procedure for LAN:", lan);
    await db.promise().query("CALL sp_calculate_forecloser_collection(?)", [lan]);
    const [rows] = await db.promise().query("SELECT * FROM temp_forecloser WHERE lan = ?", [lan]);
    console.log("📦 Result:", rows);
    res.json(rows);
  } catch (err) {
    console.error("❌ FC Procedure Error:", err);
    res.status(500).json({ error: "Failed to fetch FC data" });
  }
});

router.post("/fc/collect", async (req, res) => {
  const payload = req.body;
  
  try {
    const chargeDate = new Date();
    const formattedDate = chargeDate.toISOString().split('T')[0]; // yyyy-mm-dd

    const values = payload.map(charge => [
      charge.lan,
      formattedDate, // charge_date
      formattedDate, // due_date
      charge.amount,
      0,             // paid_amount
      0,             // waived_off
      'Unpaid',
      null,          // payment_time
      charge.charge_type,
      new Date()     // created_at
    ]);

    const query = `
      INSERT INTO loan_charges (
        lan, charge_date, due_date, amount, paid_amount, waived_off,
        paid_status, payment_time, charge_type, created_at
      ) VALUES ?
    `;

    await db.promise().query(query, [values]);

    res.status(200).json({ message: "Charges inserted successfully" });
  } catch (error) {
    console.error("❌ Error inserting charges:", error);
    res.status(500).json({ error: "Failed to insert foreclosure charges" });
  }
});


module.exports = router;
