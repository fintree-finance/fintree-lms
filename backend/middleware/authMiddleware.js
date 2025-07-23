// const jwt = require("jsonwebtoken");

// // middleware/authMiddleware.js

// const API_KEY = process.env.API_KEY || "1234567890MYSECRETKEY"; // Fallback if .env is not set

// const verifyApiKey = (req, res, next) => {
//   const apiKey = req.headers["loan-booking-api-key"];

//   if (!apiKey || apiKey !== API_KEY) {
//     return res.status(401).json({ message: "Unauthorized: Invalid API key" });
//   }

//   next(); // Key is valid, continue
// };

// const verifyToken = (req, res, next) => {
    
//     const token = req.headers["authorization"];
//     if (!token) return res.status(401).json({ message: "Access Denied" });

//     jwt.verify(token, process.env.JWT_SECRET || "secret_key", (err, decoded) => {
//         if (err) return res.status(403).json({ message: "Invalid Token" });
//         req.user = decoded;
//         next();
//     });
// };

// module.exports = verifyToken ;
// module.exports = verifyApiKey;


const jwt = require("jsonwebtoken");

// middleware/authMiddleware.js

const API_KEY = process.env.API_KEY || "1234567890MYSECRETKEY"; // Fallback if .env is not set

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers["loan-booking-api-key"];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }

  next(); // Key is valid, continue
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("❌ No Authorization header");
    return res.status(401).json({ message: "Access Denied" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("❌ Malformed Authorization header:", authHeader);
    return res.status(401).json({ message: "Invalid Auth header format" });
  }

  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET || "secret_key", (err, decoded) => {
    if (err) {
      console.log("❌ JWT verify error:", err);
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = decoded;
    console.log("✅ Token OK, user:", decoded);
    next();
  });
};



module.exports = {
  verifyToken,
  verifyApiKey,
};

