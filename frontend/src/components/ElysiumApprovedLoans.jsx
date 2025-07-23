import React from 'react'
import ApprovedLoansTable from './ApprovedLoansScreen'

const ElysiumApprovedLoans = () => {
  return (
    // BLApprovedLoans.js
<ApprovedLoansTable apiUrl={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/approved-loans?table=loan_bookings&prefix=HC`} title="Elysium Approved Loans" />

  )
}

export default ElysiumApprovedLoans