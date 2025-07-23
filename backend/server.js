require("dotenv").config();
// const fs = require("fs");
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const loanBookingRoutes = require("./routes/loanBookingRoutes");
const manualRPSRoutes = require("./routes/manualRPSRoutes"); // ✅ Import route
const loanRoutes = require("./routes/loanRoutes");
const repaymentRoutes = require("./routes/repaymentsRoutes"); // ✅ Import repayments routes
 //const disbursalRoutes = require("./routes/disbursalRoutes"); // ✅ Import Route
const DisbursalRoutes = require("./routes/DisbursalRoutes");
const chargesRoutes = require("./routes/chargesRoutes"); // ✅ Import Route
const loanChargesRoutes = require("./routes/loanChargesRoutes");
const deleteCashflowRoutes = require("./routes/deleteCashflowRoutes"); // Import Routes
const allocationRoutes = require("./routes/allocationRoutes"); // ✅ Import Route Allocation
const forecloserRoutes = require("./routes/forecloserRoutes"); // ✅ Import Route For FC Charge Create
const forecloserUploadRoutes = require("./routes/forecloserUpload"); // ✅ Import Route for FC Upload
const reportsRoutes = require("./routes/reportRoutes"); // ✅ Import Route for Reports
const applicationFormRoutes = require("./routes/applicationFormRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");



const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://fintree-finance.github.io', // <-- Your frontend GitHub Pages URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

  
  
  // Serve static files from React frontend
  // app.use(express.static(path.join(__dirname, '../Frontend/dist')));


app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/loan-booking", loanBookingRoutes);
app.use("/api", loanRoutes);
// ✅ Use the repayments route
// const reportsDir = path.join(__dirname, "../fontend/public/reports");
// if (!fs.existsSync(reportsDir)) {
//   fs.mkdirSync(reportsDir);
// }
app.use("/api/repayments", repaymentRoutes);
app.use("/api/loan-charges", loanChargesRoutes);

// ✅ Use Routes
app.use("/api/manual-rps", manualRPSRoutes); // ✅ Ensure this is mapped correctly

// ✅ Register Disbursal Route
app.use("/api/disbursal", DisbursalRoutes);
app.use("/api/application-form", applicationFormRoutes);

app.use("/api", chargesRoutes);

// Routes
app.use("/api/delete-cashflow", deleteCashflowRoutes);

// ✅ Register Routes
app.use("/api", allocationRoutes);



//app.use("/api/foreclose-collection", forecloserRoutes); // ✅ Register Route
app.use("/api/forecloser-collection", forecloserRoutes); // NOT foreclose-collection


app.use("/api/forecloser", forecloserUploadRoutes); // ✅ Register Route for Forecloser Upload FC Upload

// // Serve static reports
 //app.use("/api/reports", express.static(path.join(__dirname, "./public/reports"))); // ✅ Serve static reports
 app.use("/reports", express.static(path.join(__dirname, "/reports")));
 app.use('/generated', express.static(path.join(__dirname, 'generated')));


 

app.use("/api/reports", reportsRoutes);// ✅ Register Route for Reports
// // Serve static report files
 //app.use("/reports", express.static(path.join(__dirname, "reports")));

 //app.use("/api/reports", require("./routes/reportRoutes"));


 const reportsPath = path.join(__dirname, "../frontend/public/reports");

if (!fs.existsSync(reportsPath)) {
  fs.mkdirSync(reportsPath, { recursive: true });
}

// ✅ This is the correct place to use `app.use`
app.use("/reports", express.static(reportsPath));


app.use("/api/documents", require("./routes/documents"));// ✅ Register Route for Documents
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // To serve uploaded files


// Handle SPA (Single Page Application) routing
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
//   });

  app.get("/", (req, res) => {
    res.send("✅ Server is running properly.");
});


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


