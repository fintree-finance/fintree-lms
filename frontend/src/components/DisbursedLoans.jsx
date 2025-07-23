import React from 'react'
import DisbursedLoansTable from './DisbursedLoansScreen'

const DisbursedLoans = () => {
  return (
    <DisbursedLoansTable apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/disbursed-loans?table=loan_bookings&prefix=EV`} title="EV Disbursed Loans" />
  )
}

export default DisbursedLoans