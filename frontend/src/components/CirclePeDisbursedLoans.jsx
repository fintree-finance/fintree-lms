import React from 'react'
import DisbursedLoansTable from './DisbursedLoansScreen'

const CirclePeDisbursedLoans = () => {
  return (
    <DisbursedLoansTable apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/disbursed-loans?table=loan_bookings&prefix=HC`} title="CirclePe Disbursed Loans" />
  )
}

export default CirclePeDisbursedLoans