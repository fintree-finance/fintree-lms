import React from 'react'
import AllLoans from '../components/AllLoansScreen'


const EVAllLoans = () => {
  return (
    <AllLoans apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/all-loans?table=loan_bookings&prefix=EV`} title="EV All Loans" />
  )
}

export default EVAllLoans