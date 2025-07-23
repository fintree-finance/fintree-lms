import React from 'react'
import ApprovedLoansTable from './ApprovedLoansScreen'

const AdikoshApprovedLoans = () => {
  return (
    <ApprovedLoansTable 
        apiUrl={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/approved-loans?table=loan_booking_adikosh&prefix=ADK`} 
        title="Adikosh Approved Loans"
        lenderName="EMI"
    />
  )
}

export default AdikoshApprovedLoans;