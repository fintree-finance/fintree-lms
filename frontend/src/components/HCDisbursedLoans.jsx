import React from 'react'
import DisbursedLoansTable from './DisbursedLoansScreen'

const HCDisbursedLoans = () => {
  return (
    <DisbursedLoansTable apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/disbursed-loans?table=loan_bookings&prefix=HC`} title="Health Care Disbursed Loans" />
  )
}

export default HCDisbursedLoans