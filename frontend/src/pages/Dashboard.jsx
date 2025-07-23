import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DisbursalTrendChart from "../components/charts/DisbursalTrendChart";
import RepaymentTrendChart from "../components/charts/RepaymentTrendChart";
import CollectionVsDueChart from "../components/charts/CollectionVsDueChart";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChartFilter from "../components/charts/ChartFilter";
import ProductDistributionChart from "../components/charts/ProductDistributionChart";
import "../styles/Dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("disbursal");

  const [filters, setFilters] = useState({
    product: "ALL",
    from: "",
    to: "",
  });

  const [metrics, setMetrics] = useState({
    totalDisbursed: 0,
    totalCollected: 0,
    collectionRate: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetchMetrics();
  }, [filters]);

  const fetchMetrics = async () => {
    try {
      console.log("Sent filters:", filters);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/dashboard/metric-cards`,
        filters
      );
      setMetrics(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Metric Cards Fetch Error:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content">
          {location.pathname === "/dashboard" ? (
            <div
              className="dashboard-default"
              style={{ padding: "1rem", overflowY: "auto" }}
            >
              <ChartFilter onFilterChange={setFilters} />

              <div className="metric-cards-container">
                <div className="metric-card">
                  <div className="metric-title">Total Disbursed</div>
                  <div className="metric-value">
                    ₹
                    {Math.round(metrics.totalDisbursed).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-title">Total Collected</div>
                  <div className="metric-value">
                    ₹
                    {Math.round(metrics.totalCollected).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-title">Collection Rate</div>
                  <div className="metric-value">
                    {metrics.collectionRate.toFixed(2)}%
                  </div>
                </div>
              </div>

              <ProductDistributionChart filters={filters} />
              <div className="chart-tabs">
                <div className="tab-buttons">
                  <button
                    className={activeTab === "disbursal" ? "active" : ""}
                    onClick={() => setActiveTab("disbursal")}
                  >
                    Disbursal
                  </button>
                  <button
                    className={activeTab === "repayment" ? "active" : ""}
                    onClick={() => setActiveTab("repayment")}
                  >
                    Repayment
                  </button>
                  <button
                    className={activeTab === "collection" ? "active" : ""}
                    onClick={() => setActiveTab("collection")}
                  >
                    Collection vs Due
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === "disbursal" && (
                    <DisbursalTrendChart filters={filters} />
                  )}
                  {activeTab === "repayment" && (
                    <RepaymentTrendChart filters={filters} />
                  )}
                  {activeTab === "collection" && (
                    <CollectionVsDueChart filters={filters} />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
