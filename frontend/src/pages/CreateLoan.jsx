// import React, { useState } from "react";
// import axios from "axios";

// const CreateLoan = () => {
//     const [customerName, setCustomerName] = useState("");
//     const [loanAmount, setLoanAmount] = useState("");
//     const [mobileNumber, setMobileNumber] = useState("");

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         const loanData = {
//             customer_name: customerName,
//             loan_amount: loanAmount,
//             mobile_number: mobileNumber,
//             status: "Approved"  // New loan is directly approved
//         };

//         try {
//             await axios.post("${import.meta.env.VITE_API_BASE_URL}/api/ev-loans", loanData);
//             alert("Loan successfully created and moved to Approved Loans!");
//         } catch (error) {
//             console.error("Error creating loan:", error);
//         }
//     };

//     return (
//         <div>
//             <h2>Create EV Loan</h2>
//             <form onSubmit={handleSubmit}>
//                 <label>Customer Name:</label>
//                 <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />

//                 <label>Loan Amount:</label>
//                 <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} required />

//                 <label>Mobile Number:</label>
//                 <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />

//                 <button type="submit">Create Loan</button>
//             </form>
//         </div>
//     );
// };

// export default CreateLoan;
