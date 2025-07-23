import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoanSidebar from "../components/LoanSidebar"; // ✅ Import Sidebar
import LoanDetails from "../components/LoanDetails"; // ✅ Loan Details Component
import DisbursementDetails from "../components/DisburstmentDetails"; // ✅ Disbursement Component
import Schedule from "../components/Schedule"; // ✅ Schedule Component
import FintreeSchedule from "../components/FintreeSchedule"; // ✅ Fintree Schedule Component
import PartnerSchedule from "../components/PartnerSchedule"; // ✅ Partner Schedule Component
import ChargesCashflow from "../components/ChargesCashflow"; // ✅ Charges & Cashflow Component
import ExtraCharges from "../components/ExtraCharges"; // ✅ Extra Charges Component
import Allocation from "../components/Allocation"; // ✅ Allocation Component
import FintreeROI from "../components/FintreeROI";
import "../styles/LoanDetailsPage.css"; // ✅ Ensure styles exist
import ForecloserCollection from "../components/ForecloserCollection"; // ✅ Import Forecloser Collection Component
import DocumentsPage from "../pages/DocumentsPage";
import ActionButtons from "../components/ActionButtons";


const LoanDetailsPage = () => {
    const { lan } = useParams();
    const [loanData, setLoanData] = useState(null);
    const [selectedSection, setSelectedSection] = useState("loan-details"); // ✅ Default Section
    const [isAdikosh, setIsAdikosh] = useState(false);

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/${lan}`);
                setLoanData(response.data);
            } catch (err) {
                console.error("Failed to fetch loan details.");
            }
        };

       

        fetchLoanDetails();
        setIsAdikosh(lan.includes("AD"));
    }, [lan]);


    if (!loanData) return <p className="loading-text">Loading...</p>;

    return (
        <div className="loan-details-container">
            {/* ✅ Customer Details (Full Width) */}
            <div className="loan-customer-info">
                <h2>Loan Application By {loanData.customer_name}</h2>
                <p><strong>LAN:</strong> {loanData.lan}</p>
                <p><strong>Created At:</strong> {loanData.login_date}</p>
                <p><strong>Mobile:</strong> {loanData.mobile_number}</p>
                <p><strong>Email:</strong> {loanData.email}</p>
                <p><strong>Status:</strong> {loanData.status}</p>
            </div>

            {/* ✅ Sidebar + Content Layout */}
            <div className="loan-content-layout">
                <LoanSidebar onSelect={setSelectedSection} isAdikosh={isAdikosh} />
                <div className="loan-dynamic-section">
                    {selectedSection === "loan-details" && <LoanDetails data={loanData} />}
                    {selectedSection === "disbursement-details" && <DisbursementDetails data={loanData} />}
                    {selectedSection === "schedule" && <Schedule lan={lan} />}
                    {isAdikosh && selectedSection === "fintree-schedule" && <FintreeSchedule lan={lan} />}
                    {isAdikosh && selectedSection === "partner-schedule" && <PartnerSchedule lan={lan} />}
                    {isAdikosh && selectedSection === "fintree-roi%" && <FintreeROI lan={lan} />}
                    {/* {selectedSection === "fintree-schedule" && <FintreeSchedule lan={lan} />}
                    {selectedSection === "partner-schedule" && <PartnerSchedule lan={lan} />} */}
                    {selectedSection === "charges-cashflow" && <ChargesCashflow data={loanData} />}
                    {selectedSection === "extra-charges" && <ExtraCharges data={loanData} />}
                    {selectedSection === "allocation" && <Allocation data={loanData} />}
                    {selectedSection === "forecloser-collection" && <ForecloserCollection lan={lan} />}
                    {selectedSection === "documents-page" && <DocumentsPage lan={lan}  />}
                    {selectedSection === "action-page" && <ActionButtons lan={lan}  />}   

                </div>
            </div>
        </div>
    );
};

export default LoanDetailsPage;