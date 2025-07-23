import React from 'react'
import AllLoans from './AllLoansScreen'


const BLAllLoans = () => {
  return (
    <AllLoans apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/all-loans?table=loan_bookings&prefix=BL`} title="BL All Loans" />
  )
}

export default BLAllLoans