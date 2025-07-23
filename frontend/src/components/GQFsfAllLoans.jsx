import React from 'react'
import AllLoans from './AllLoansScreen'


const GQFsfAllLoans = () => {
  return (
    <AllLoans apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/all-loans?table=loan_booking_gq_fsf&prefix=GQF`} title="GQ FSF All Loans" />
  )
}

export default GQFsfAllLoans