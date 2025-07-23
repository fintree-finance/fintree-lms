import React from "react";
import DisbursedLoansTable from "./DisbursedLoansScreen";

const AdikoshDisbursedLoans = () => (
    <DisbursedLoansTable apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/disbursed-loans?table=loan_booking_adikosh&prefix=ADK`} title="Adikosh Disbursed Loans" />
);

export default AdikoshDisbursedLoans;
