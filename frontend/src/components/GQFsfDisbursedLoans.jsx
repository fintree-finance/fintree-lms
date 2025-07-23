import React from 'react'
import DisbursedLoansTable from './DisbursedLoansScreen'

const GQFsfDisbursedLoans = () => {
  return (
    <DisbursedLoansTable apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/disbursed-loans?table=loan_booking_gq_fsf&prefix=GQF`} title="GQ FSF Disbursed Loans" />
  )
}

export default GQFsfDisbursedLoans