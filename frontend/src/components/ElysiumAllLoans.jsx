import React from 'react'
import AllLoans from './AllLoansScreen'


const ElysiumAllLoans = () => {
  return (
    <AllLoans apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/all-loans?table=loan_bookings&prefix=HC`} title="Elysium All Loans" />
  )
}

export default ElysiumAllLoans