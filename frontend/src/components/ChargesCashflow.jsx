import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ChargesCashflow.css"; // ✅ Import CSS file

const ChargesCashflow = () => {
    const { lan } = useParams();
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
    const formatDate = (dateString) => {

        if (!dateString) return "-"; // ✅ Handle null/undefined values



        try {

            const date = new Date(dateString); // ✅ Parse correctly

            return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });

        } catch (error) {

            console.error("Date parsing error:", error, dateString);

            return "Invalid Date"; // ✅ Ensure no frontend crashes

        }

    };


    if (loading) return <p className="loading-text">⏳ Loading charges & cashflow...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="charges-cashflow-container">
            <h2>Charges & Cashflow</h2>
            <div className="charges-table-container">
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
                                <td style={{ fontWeight: 'bold' }}>{entry.lan}</td>
                                <td style={{ fontWeight: 'bold' }}>{formatDate(entry.bank_date)}</td>
                                <td style={{ fontWeight: 'bold' }}>{entry.utr}</td>
                                <td style={{ fontWeight: 'bold' }}>{formatDate(entry.payment_date)}</td>
                                <td style={{ fontWeight: 'bold' }}>{entry.payment_id}</td>
                                <td style={{ fontWeight: 'bold' }}>{entry.payment_mode}</td>
                                <td style={{ fontWeight: 'bold' }}>{entry.transfer_amount}</td>
                                <td style={{ fontWeight: 'bold' }}>{entry.created_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChargesCashflow;
