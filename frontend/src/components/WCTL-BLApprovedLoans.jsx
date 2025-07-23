import React from "react";
import ApprovedLoansTable from "./ApprovedLoansScreen";

const WCTLBLApprovedLoans = () => {
  return (
    // BLApprovedLoans.js
    <ApprovedLoansTable
      apiUrl={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/approved-loans?table=loan_bookings_wctl&prefix=WCTL`}
      title="WCTL-BL Approved Loans"
    />
  );
};

export default WCTLBLApprovedLoans;
