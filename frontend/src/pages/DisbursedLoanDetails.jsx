// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const DisbursedLoanDetails = () => {
//   const { lan } = useParams(); // ✅ Get LAN from URL
//   const [loan, setLoan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchLoanDetails = async () => {
//       try {
//         const response = await axios.get(
//           `http://192.168.0.200:5000/api/loan-booking/disbursed/${lan}`
//         );
//         setLoan(response.data);
//       } catch (err) {
//         setError("Failed to fetch loan details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLoanDetails();
//   }, [lan]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2>Loan Application By {loan.customer_name}</h2>
//       <p>
//         <strong>LAN:</strong> {loan.lan}
//       </p>
//       <p>
//         <strong>Created At:</strong> {loan.login_date}
//       </p>
//       <p>
//         <strong>Mobile Number:</strong> {loan.mobile_number}
//       </p>
//       <p>
//         <strong>Email:</strong> {loan.email}
//       </p>
//       <p>
//         <strong>Dedupe Match:</strong> {loan.dedupe_match ? "True" : "False"}
//       </p>

//       <h3>Loan Details</h3>
//       <label>Approved Loan Amount (with interest)</label>
//       <input type="text" value={loan.loan_amount} readOnly />

//       <label>Interest Rate</label>
//       <input type="text" value={loan.interest_rate} readOnly />

//       <label>Installment Amount</label>
//       <input type="text" value={loan.emi_amount} readOnly />

//       <label>Number of Installments</label>
//       <input type="text" value={loan.loan_tenure} readOnly />

//       <label>Payment Frequency</label>
//       <input type="text" value="MONTHLY" readOnly />

//       <label>Approval Status</label>
//       <input type="text" value={loan.status} readOnly />

//       <h3>Disbursal Details</h3>
//       <p>
//         <strong>Disbursement UTR:</strong> {loan.Disbursement_UTR}
//       </p>
//       <p>
//         <strong>Disbursement Date:</strong> {loan.Disbursement_Date}
//       </p>
//     </div>
//   );
// };

// export default DisbursedLoanDetails;


////////////////////////////////////
////// sidebar code //////

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/DisbursedLoans.css";

// const DisbursedLoans = () => {
//     const [disbursedLoans, setDisbursedLoans] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchDisbursedLoans = async () => {
//             try {
//                 const response = await axios.get("http://192.168.0.200:5000/api/loan-booking/disbursed");
//                 setDisbursedLoans(response.data);
//             } catch (err) {
//                 console.error("Failed to fetch disbursed loans.");
//             }
//         };

//         fetchDisbursedLoans();
//     }, []);

//     return (
//         <div className="disbursed-loans-container">
//             <h2>Disbursed Loans</h2>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Customer Name</th>
//                         <th>LAN</th>
//                         <th>Disbursement Amount</th>
//                         <th>Disbursement Date</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {disbursedLoans.map((loan) => (
//                         <tr key={loan.lan}>
//                             <td>
//                                 <span 
//                                     className="clickable" 
//                                     onClick={() => navigate(`/dashboard/loan-details/${loan.lan}`)} // ✅ Fix: Add `/dashboard/`
//                                 >
//                                     {loan.customer_name}
//                                 </span>
//                             </td>
//                             <td>
//                                 <span 
//                                     className="clickable" 
//                                     onClick={() => navigate(`/dashboard/loan-details/${loan.lan}`)} // ✅ Fix: Add `/dashboard/`
//                                 >
//                                     {loan.lan}
//                                 </span>
//                             </td>
//                             <td>{loan.disbursement_amount}</td>
//                             <td>{loan.disbursement_date}</td>
//                             <td>{loan.status}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default DisbursedLoans;


import React from 'react'

const DisbursedLoanDetails = () => {
  return (
    <div>DisbursedLoanDetails</div>
  )
}

export default DisbursedLoanDetails