import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateLoanBooking from "./pages/CreateLoanBooking";
import ApprovedLoans from "./pages/ApprovedLoans";
import DisbursedLoans from "./components/DisbursedLoans";
import AllLoans from "./pages/AllLoans";
import UploadUTR from "./pages/UploadUTR";
import LoanDetailsPage from "./pages/LoanDetailsPage";
import ManualRPSUpload from "./pages/ManualRPSUpload";
import RepaymentsUpload from "./components/RepaymentsUpload";
import CreateChargesUpload from "./pages/CreateChargesUpload";
import HCApprovedLoans from "./components/HCApprovedLoans";
import BLApprovedLoans from "./components/BLApprovedLoans";
import HCDisbursedLoans from "./components/HCDisbursedLoans";
import BLDisbursedLoans from "./components/BLDisbursedLoans";
import HCAllLoans from "./components/HCAllLoans";
import BLAllLoans from "./components/BLAllLoans";
import GQFsfApprovedLoans from "./components/GQFsfApprovedLoans";
import GQFsfDisbursedLoans from "./components/GQFsfDisbursedLoans";
import GQFsfAllLoans from "./components/GQFsfAllLoans";
import GQNonFsfApprovedLoans from "./components/GQNonFsfApprovedLoans";
import GQNonFsfDisbursedLoans from "./components/GQNonFsfDisbursedLoans";
import GQNonFsfAllLoans from "./components/GQNonFsfAllLoans";
import AdikoshApprovedLoans from "./components/AdikoshApprovedLoans";
import AdikoshDisbursedLoans from "./components/AdikoshDisbursedLoans";
import AdikoshAllLoans from "./components/AdikoshAllLoans";
import DeleteCashflow from "./pages/DeleteCashflow";
import ForecloserUpload from "./components/ForecloserUpload"; // ✅ Import the component use for FC & charges Upload
import ReportsListing from "./pages/Reports/ReportsListing"; // ✅ Import the component use for FC & charges Upload
import ReportDetail from "./pages/Reports/ReportDetail"; // ✅ Import the component use for FC & charges Upload
import TriggerReportForm from "./pages/Reports/TriggerReportForm"; // ✅ Import the component use for FC & charges Upload
import DownloadedReports from "./pages/Reports/DownloadedReports"; // ✅ Import the component use for FC & charges Upload
import ApprovedCaseDetails from "./components/ApprovedCaseDetails";
import LoanApplicationForm from "./components/LoanApplicationForm";
import DownloadTemplatePage from "./components/DownloadTemplate";
import AldunActiveLoans from "./components/AldunActiveCases";
import AldunCollection from "./components/AldunCollection";
import CirclePeApprovedLoans from "./components/CirclePeApprovedLoans";
import CirclePeDisbursedLoans from "./components/CirclePeDisbursedLoans";
import CirclePeAllLoans from "./components/CirclePeAllLoans";
import ElysiumApprovedLoans from "./components/ElysiumApprovedLoans";
import ElysiumDisbursedLoans from "./components/ElysiumDisbursedLoans";
import ElysiumAllLoans from "./components/ElysiumAllLoans";
import WCTLBLAllLoan from "./components/WCTL-BLAllLoans";
import WCTLBLApprovedLoans from "./components/WCTL-BLApprovedLoans";
import WCTLBLDisbursedLoans from "./components/WCTL-BLDisbursedLoans";
// import DocumentsPage from "./pages/DocumentsPage"; // ✅ Import the Documents page
// import UniqueIdDetails from "./pages/UniqueIdDetails"; // Top of the file

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Route: Login */}
        <Route path="/" element={<Login />} />

        {/* ✅ Protected Routes (Require Authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            {/* ✅ These pages will render inside Dashboard (inside <Outlet />) */}
            <Route path="create-loan-booking" element={<CreateLoanBooking />} />
            <Route path="ev-loans/approved" element={<ApprovedLoans />} />
            <Route path="ev-loans/disbursed" element={<DisbursedLoans />} />
            <Route path="ev-loans/all" element={<AllLoans />} />
            <Route
              path="health-care-loans/approved"
              element={<HCApprovedLoans />}
            />
            <Route
              path="health-care-loans/disbursed"
              element={<HCDisbursedLoans />}
            />
            <Route path="health-care-loans/all" element={<HCAllLoans />} />
            <Route
              path="business-loans/approved"
              element={<BLApprovedLoans />}
            />
            <Route
              path="business-loans/disbursed"
              element={<BLDisbursedLoans />}
            />
            <Route path="business-loans/all" element={<BLAllLoans />} />
            <Route path="ev-loans/upload-utr" element={<UploadUTR />} />
            <Route path="manual-rps-upload" element={<ManualRPSUpload />} />
            <Route path="repayments-upload" element={<RepaymentsUpload />} />
            <Route path="gq-fsf-loans/approved" element={<GQFsfApprovedLoans />}/>
            <Route path="gq-fsf-loans/disbursed" element={<GQFsfDisbursedLoans />}/>
            <Route path="gq-fsf-loans/all" element={<GQFsfAllLoans />} />
            <Route path="gq-non-fsf-loans/approved" element={<GQNonFsfApprovedLoans />}/>
            <Route path="gq-non-fsf-loans/disbursed" element={<GQNonFsfDisbursedLoans />} />
            <Route path="gq-non-fsf-loans/all" element={<GQNonFsfAllLoans />} />
            <Route path="circlepe-loans/approved" element={<CirclePeApprovedLoans />}/>
            <Route path="circlepe-loans/disbursed" element={<CirclePeDisbursedLoans />} />
            <Route path="circlepe-loans/all" element={<CirclePeAllLoans />} />
            <Route path="elysium-loans/approved" element={<ElysiumApprovedLoans />}/>
            <Route path="elysium-loans/disbursed" element={<ElysiumDisbursedLoans />} />
            <Route path="elysium-loans/all" element={<ElysiumAllLoans />} />

            <Route path="wctl-bl-loans/all" element={<WCTLBLAllLoan />} />
            <Route
              path="wctl-bl-loans/approved"
              element={<WCTLBLApprovedLoans />}
            />
            <Route
              path="wctl-bl-loans/disbursed"
              element={<WCTLBLDisbursedLoans />}
            />

            <Route
              path="adikosh-loans/approved"
              element={<AdikoshApprovedLoans />}
            />
            <Route
              path="adikosh-loans/disbursed"
              element={<AdikoshDisbursedLoans />}
            />
            <Route path="adikosh-loans/all" element={<AdikoshAllLoans />} />

            <Route path="loan-details/:lan" element={<LoanDetailsPage />} />
            <Route
              path="approved-loan-details/:lan"
              element={<ApprovedCaseDetails />}
            />
            <Route
              path="create-loan-charges"
              element={<CreateChargesUpload />}
            />
            <Route
              path="loan-application-form"
              element={<LoanApplicationForm />}
            />
            <Route
              path="products-excel-format"
              element={<DownloadTemplatePage />}
            />
            <Route path="delete-cashflow" element={<DeleteCashflow />} />
            <Route path="forecloserUpload" element={<ForecloserUpload />} />
            <Route path="mis-reports/listing" element={<ReportsListing />} />
            <Route path="mis-reports/:reportId" element={<ReportDetail />} />
            <Route path="aldun-loans/approved" element={<AldunActiveLoans />} />
            <Route
              path="aldun-loans/collection/:loan_account_number"
              element={<AldunCollection />}
            />
            <Route
              path="mis-reports/:reportId/trigger"
              element={<TriggerReportForm />}
            />
            <Route
              path="mis-reports/:reportId/downloads"
              element={<DownloadedReports />}
            />
          </Route>
        </Route>

        {/* ✅ Fallback Route (404 Not Found) */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
