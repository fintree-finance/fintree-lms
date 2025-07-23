import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ChargesCashflow.css";

const ChargesCashflow = () => {
    const { lan } = useParams(); // ✅ Get LAN from URL
    const [cashflowData, setCashflowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCashflowData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/charges-cashflow/${lan}`);
                setCashflowData(response.data);
            } catch (err) {
                console.error("❌ Failed to fetch charges cashflow:", err);
                setError("❌ Error fetching cashflow data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCashflowData();
    }, [lan]);

    if (loading) return <p className="loading-text">⏳ Loading charges & cashflow...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="charges-cashflow-container">
            <h2>Charges & Cashflow</h2>
            <table>
                <thead>
                    <tr>
                        <th>LAN</th>
                        <th>Bank Date</th>
                        <th>UTR</th>
                        <th>Payment Date</th>
                        <th>Payment ID</th>
                        <th>Payment Mode</th>
                        <th>Transfer Amount</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {cashflowData.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.lan}</td>
                            <td>{entry.bank_date}</td>
                            <td>{entry.utr}</td>
                            <td>{entry.payment_date}</td>
                            <td>{entry.payment_id}</td>
                            <td>{entry.payment_mode}</td>
                            <td>{entry.transfer_amount}</td>
                            <td>{entry.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChargesCashflow;
