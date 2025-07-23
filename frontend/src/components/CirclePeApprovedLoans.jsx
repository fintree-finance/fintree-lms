import React from 'react'
import ApprovedLoansTable from './ApprovedLoansScreen'

const CirclePeApprovedLoans = () => {
  return (
    // BLApprovedLoans.js
<ApprovedLoansTable apiUrl={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/approved-loans?table=loan_bookings&prefix=HC`} title="Circle Pe Approved Loans" />

  )
}

export default CirclePeApprovedLoans