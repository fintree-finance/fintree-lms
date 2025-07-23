// src/components/ApprovedLoansTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ApprovedLoans.css";

const ApprovedLoansTable = ({ apiUrl, title = "Approved Loans", lenderName = "EMI" }) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(apiUrl)
            .then((response) => {
                setLoans(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching loans:", error);
                setError("Failed to fetch data.");
                setLoading(false);
            });
    }, [apiUrl]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="approved-loans-container">
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Loan Details</th>
                        <th>Lender</th>
                        <th>Partner Loan ID</th>
                        <th>LAN</th>
                        <th>Customer ID</th>
                        <th>Mobile Number</th>
                        <th>Status</th>
                        <th>Disbursement Date</th>
                        <th>Audit Trails</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map((loan) => (
                        <tr key={loan.id}>
                            <td>
                                <span className="clickable" onClick={() => navigate(`/dashboard/approved-loan-details/${loan.lan}`)}>
                                    {loan.customer_name}
                                </span>
                            </td>
                            <td>{lenderName}</td>
                            <td>{loan.partner_loan_id}</td>
                            <td>{loan.lan}</td>
                            <td>{loan.customer_id}</td>
                            <td>
                                <a href={`tel:${loan.mobile_number}`} className="phone-number">
                                    {loan.mobile_number}
                                </a>
                            </td>
                            <td><span className="status-approved">Approved</span></td>
                            <td>{loan.disbursement_date || "-"}</td>
                            <td><button className="audit-trail-btn">≡</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApprovedLoansTable;
