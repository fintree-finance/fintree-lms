import React from 'react'
import ApprovedLoansTable from './ApprovedLoansScreen'

const GQFsfApprovedLoans = () => {
  return (
    // BLApprovedLoans.js
<ApprovedLoansTable apiUrl={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/approved-loans?table=loan_booking_gq_fsf&prefix=GQF`} title="GQ FSF Approved Loans" />

  )
}

export default GQFsfApprovedLoans