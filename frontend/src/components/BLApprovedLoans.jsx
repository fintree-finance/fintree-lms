import React from "react";
import ApprovedLoansTable from "./ApprovedLoansScreen";

const BLApprovedLoans = () => {
  return (
    // BLApprovedLoans.js
    <ApprovedLoansTable
      apiUrl={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/approved-loans?table=loan_bookings&prefix=BL`}
      title="BL Approved Loans"
    />
  );
};

export default BLApprovedLoans;
