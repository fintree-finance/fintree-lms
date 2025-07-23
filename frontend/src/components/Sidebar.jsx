import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const [openSections, setOpenSections] = useState({});

  const getLinkClass = (path) =>
    location.pathname === path ? "active-link" : "";

  // Config-driven sidebar structure
  const loanSections = [
    {
      key: "evLoans",
      title: "EV Loans",
      links: [
        { to: "/dashboard/ev-loans/approved", label: "Approved Loans" },
        { to: "/dashboard/ev-loans/disbursed", label: "Disbursed Loans" },
        { to: "/dashboard/ev-loans/all", label: "All Loans" },
      ],
    },
    {
      key: "healthCareLoans",
      title: "Health Care Loans",
      links: [
        { to: "/dashboard/health-care-loans/approved", label: "Approved Loans" },
        { to: "/dashboard/health-care-loans/disbursed", label: "Disbursed Loans" },
        { to: "/dashboard/health-care-loans/all", label: "All Loans" },
      ],
    },
    {
      key: "businessLoans",
      title: "Business Loans(BL)",
      links: [
        { to: "/dashboard/business-loans/approved", label: "Approved Loans" },
        { to: "/dashboard/business-loans/disbursed", label: "Disbursed Loans" },
        { to: "/dashboard/business-loans/all", label: "All Loans" },
      ],
    },
    {
      key: "wctlBLLoans",
      title: "WCTL-BL Loans",
      links: [
        { to: "/dashboard/wctl-bl-loans/approved", label: "Approved Loans" },
        { to: "/dashboard/wctl-bl-loans/disbursed", label: "Disbursed Loans" },
        { to: "/dashboard/wctl-bl-loans/all", label: "All Loans" },
      ],
    },
    {
      key: "gqFSFLoans",
      title: "GQ FSF Loan",
      links: [
        { to: "/dashboard/gq-fsf-loans/approved", label: "Approved Loans" },
        { to: "/dashboard/gq-fsf-loans/disbursed", label: "Disbursed Loans" },
        { to: "/dashboard/gq-fsf-loans/all", label: "All Loans" },
      ],
    },
    {
      key: "gqNonFSFLoans",
      title: "GQ Non-FSF Loan",
      links: [
        { to: "/dashboard/gq-non-fsf-loans/approved", label: "Approved Loans" },
        { to: "/dashboard/gq-non-fsf-loans/disbursed", label: "Disbursed Loans" },
        { to: "/dashboard/gq-non-fsf-loans/all", label: "All Loans" },
      ],
    },
    {
      key: "adikoshLoans",
      title: "Adikosh Loans",
      links: [
        { to: "/dashboard/adikosh-loans/approved", label: "Approved Loans" },
        { to: "/dashboard/adikosh-loans/disbursed", label: "Disbursed Loans" },
        { to: "/dashboard/adikosh-loans/all", label: "All Loans" },
      ],
    },
    {
      key: "circlePeLoans",
      title: "Circle PE Loans",
      links: [
        { to: "/dashboard/circlepe-loans/approved", label: "Approved Loans" },
        { to: "/dashboard/circlepe-loans/disbursed", label: "Disbursed Loans" },
      ],
    },
    {
      key: "aldunLoans",
      title: "Aldun",
      links: [
        { to: "/dashboard/aldun-loans/approved", label: "Aldun Active Cases" },
      ],
    },
    {
      key: "misReports",
      title: "MIS Reports",
      links: [
        { to: "/dashboard/mis-reports/listing", label: "Reports Listing" },
      ],
    },
  ];

  useEffect(() => {
    const updatedOpenSections = {};
    loanSections.forEach((section) => {
      updatedOpenSections[section.key] = section.links.some((link) =>
        location.pathname.includes(link.to)
      );
    });
    setOpenSections((prev) => ({ ...prev, ...updatedOpenSections }));
  }, [location.pathname]);

  const toggleSection = (key) => {
    setOpenSections((prev) => {
      const newState = {};
      Object.keys(prev).forEach((k) => (newState[k] = false)); // collapse all
      newState[key] = !prev[key]; // toggle selected
      return newState;
    });
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/dashboard" className={getLinkClass("/dashboard")}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard/create-loan-booking" className={getLinkClass("/dashboard/create-loan-booking")}>
            Excel Uploads
          </Link>
        </li>
        <li>
          <Link to="/dashboard/ev-loans/upload-utr" className={getLinkClass("/dashboard/ev-loans/upload-utr")}>
            Upload UTR
          </Link>
        </li>
        <li>
          <Link to="/dashboard/manual-rps-upload" className={getLinkClass("/dashboard/manual-rps-upload")}>
            Manual RPS Upload
          </Link>
        </li>
        <li>
          <Link to="/dashboard/repayments-upload" className={getLinkClass("/dashboard/repayments-upload")}>
            Repayments Upload
          </Link>
        </li>
        <li>
          <Link to="/dashboard/create-loan-charges" className={getLinkClass("/dashboard/create-loan-charges")}>
            Create Charges Upload
          </Link>
        </li>
        <li>
          <Link to="/dashboard/delete-cashflow" className={getLinkClass("/dashboard/delete-cashflow")}>
            Delete Cashflow Upload
          </Link>
        </li>
        <li>
          <Link to="/dashboard/forecloserUpload" className={getLinkClass("/dashboard/forecloserUpload")}>
            Foreclosure & Charges Upload
          </Link>
        </li>

        {/* Render loan sections dynamically */}
        {loanSections.map((section) => (
          <li key={section.key}>
            <button className="sidebar-toggle" onClick={() => toggleSection(section.key)}>
              {section.title} {openSections[section.key] ? "▼" : "▶"}
            </button>
            {openSections[section.key] && (
              <ul className="submenu">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={getLinkClass(link.to)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        <li>
          <Link to="/dashboard/loan-application-form" className={getLinkClass("/dashboard/loan-application-form")}>
            Loan Application Form
          </Link>
        </li>
        <li>
          <Link to="/dashboard/products-excel-format" className={getLinkClass("/dashboard/products-excel-format")}>
            Products Excel Format
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
