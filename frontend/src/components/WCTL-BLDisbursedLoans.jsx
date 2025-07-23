import React from 'react'
import DisbursedLoansTable from './DisbursedLoansScreen'

const WCTLBLDisbursedLoans = () => {
  return (
    <DisbursedLoansTable apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/disbursed-loans?table=loan_bookings_wctl&prefix=WCTL`} title="WCTL-BL Disbursed Loans" />
  )
}

export default WCTLBLDisbursedLoans