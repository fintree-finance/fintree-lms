import React from 'react'
import ApprovedLoansTable from './ApprovedLoansScreen'

const HCApprovedLoans = () => {
  return (
    <ApprovedLoansTable apiUrl={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/approved-loans?table=loan_bookings&prefix=HC`} title="Health Care Approved Loans" />
  )
}

export default HCApprovedLoans