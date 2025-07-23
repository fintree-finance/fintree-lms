import React from 'react'
import AllLoans from './AllLoansScreen'


const HCAllLoans = () => {
  return (
    <AllLoans apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/all-loans?table=loan_bookings&prefix=HC`} title="HC All Loans" />
  )
}

export default HCAllLoans