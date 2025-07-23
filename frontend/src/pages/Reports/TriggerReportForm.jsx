import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import axios from "axios";
import "../../styles/TriggerReportForm.css"; // Import your CSS here

const TriggerReportForm = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [product, setProduct] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productOptions = [
    { label: "EV Loan", value: "EV Loan" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "BL Loan", value: "BL Loan" },
    { label: "GQ FSF", value: "GQ FSF" },
    { label: "GQ Non-FSF", value: "GQ Non-FSF" },
    { label: "Adikosh", value: "Adikosh" },

  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !product) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const payload = {
      reportId,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      product: product.value,
      description,
    };
    

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/reports/trigger`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("✅ Report triggered successfully!");
      setStartDate(null);
      setEndDate(null);
      setProduct(null);
      setDescription("");
      navigate(`/dashboard/mis-reports/listing`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error triggering report:", error);
      alert("❌ Failed to trigger report.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="trigger-report-container">
      <h4 className="trigger-title">Run Report - {reportId}</h4>

      <form onSubmit={handleSubmit} className="trigger-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">* EMI Due Date Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select date"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">* EMI Due Date End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select date"
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">* Product</label>
          <Select
            options={productOptions}
            value={product}
            onChange={setProduct}
            placeholder="Search For Choices"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            placeholder="Add description for your report"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="submit-button-wrapper">
        <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
  {isSubmitting ? "Triggering..." : "Trigger Report"}
</button>

        </div>
      </form>
    </div>
  );
};

export default TriggerReportForm;

