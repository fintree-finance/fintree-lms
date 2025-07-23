import React from 'react'
import DisbursedLoansTable from './DisbursedLoansScreen'

const BLDisbursedLoans = () => {
  return (
    <DisbursedLoansTable apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/disbursed-loans?table=loan_bookings&prefix=BL`} title="BL Disbursed Loans" />
  )
}

export default BLDisbursedLoans