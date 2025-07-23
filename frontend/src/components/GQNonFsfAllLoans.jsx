import React from 'react'
import AllLoans from './AllLoansScreen'


const GQNonFsfAllLoans = () => {
  return (
    <AllLoans apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/all-loans?table=loan_booking_gq_non_fsf&prefix=GQN`} title="GQ Non FSF All Loans" />
  )
}

export default GQNonFsfAllLoans