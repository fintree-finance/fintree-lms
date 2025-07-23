
// const express = require("express");
// const db = require("../config/db");

// const router = express.Router();

// router.get("/allocations/:lan", async (req, res) => {
//     const lan = req.params.lan;
//     try {
//         console.log(`🔍 Fetching allocation records for LAN: ${lan}...`);

//         const query = `
//             SELECT 
//                 id, due_date, allocation_date, allocated_amount, charge_type, created_at, payment_id 
//             FROM allocation 
//             WHERE lan = ? 
//             ORDER BY allocation_date ASC;
//         `;

//         const [rows] = await db.promise().query(query, [lan]);

//         if (rows.length === 0) {
//             console.warn(`⚠️ No allocation records found for LAN: ${lan}.`);
//             return res.json({ message: "No allocation records found", allocations: [] });
//         }

//         console.log("✅ Allocation Data Retrieved:", rows);
//         res.json({ allocations: rows });

//     } catch (error) {
//         console.error("❌ Error fetching allocations:", error);
//         res.status(500).json({ error: "Error fetching allocation data" });
//     }
// });

// module.exports = router;
const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/allocations/:lan", async (req, res) => {
  const lan = req.params.lan?.trim();

  try {
    console.log(`🔍 Fetching allocation records for LAN: ${lan}...`);

    if (!lan) {
      return res.status(400).json({ error: "LAN is required" });
    }

    // Infer lender based on LAN prefix
    const lanPrefix = lan.slice(0, 4).toUpperCase(); // e.g. ADKF from ADKF111014

    let allocationTable = "allocation";

    if (lanPrefix === "ADKF") {
      allocationTable = "allocation_adikosh_fintree";
    } else if (lanPrefix === "ADKP") {
      allocationTable = "allocation_adikosh_partner";
    } else if (lanPrefix === "ADK-") {
      allocationTable = "allocation_adikosh";
    }

    const query = `
      SELECT 
        id, due_date, allocation_date, allocated_amount, charge_type, created_at, payment_id 
      FROM ${allocationTable}
      WHERE lan = ? 
      ORDER BY allocation_date ASC;
    `;

    const [rows] = await db.promise().query(query, [lan]);

    if (rows.length === 0) {
      console.warn(`⚠️ No allocation records found for LAN: ${lan}.`);
      return res.json({ message: "No allocation records found", allocations: [] });
    }

    console.log(`✅ ${allocationTable} data fetched successfully.`);
    res.json({ allocations: rows });

  } catch (error) {
    console.error("❌ Error fetching allocations:", error);
    res.status(500).json({ error: "Error fetching allocation data" });
  }
});

module.exports = router;

