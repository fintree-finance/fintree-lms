import React, { useState } from "react";
import axios from "axios";
import "../styles/UploadUTR.css";

const UploadUTR = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");
    setIsError(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file to upload.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/upload-utr`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadPercentage(percent);
          },
        }
      );

      setMessage(`✅ ${response.data.message}`);
      setIsError(false);
    } catch (error) {
      setMessage("❌ Error uploading file.");
      setIsError(true);
      setUploadPercentage(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="utr-upload-container">
      <h2>Upload Loan Booking - Disbursement UTRs</h2>
      <input type="file" onChange={handleFileChange} accept=".xlsx,.csv" />

      <button onClick={handleUpload} disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Upload"}
      </button>

      {uploadPercentage > 0 && (
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${uploadPercentage}%` }}
          ></div>
          <span>{uploadPercentage}%</span>
        </div>
      )}

      {message && (
        <p className={`upload-message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadUTR;