import React from 'react'
import AllLoans from './AllLoansScreen'


const AdikoshAllLoans = () => {
  return (
    <AllLoans apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/all-loans?table=loan_booking_adikoshf&prefix=ADK`} title="Adikosh All Loans" />
  )
}

export default AdikoshAllLoans