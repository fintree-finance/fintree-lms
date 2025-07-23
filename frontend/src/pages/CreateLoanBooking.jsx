import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateLoanBooking.css"; // Import CSS for styling

const CreateLoanBooking = () => {
  const [skippedRows, setSkippedRows] = useState([]);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadType, setUploadType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0); // Store upload percentage

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");
    setError(""); // Clear previous messages
  };

  const apiEndpoint = getApiEndpoint(uploadType);

  function getApiEndpoint(uploadType) {
    if (uploadType === "Health Care") {
      return `${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/hc-upload`;
    } else if (uploadType === "BL Loan") {
      return `${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/bl-upload`;
    } else if (uploadType === "EV Loan") {
      return `${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/upload`;
    } else if (uploadType === "GQ FSF") {
      return `${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/gq-fsf-upload`;
    } else if (uploadType === "GQ Non-FSF") {
      return `${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/gq-non-fsf-upload`;
    }else if (uploadType === "Adikosh") {
      return `${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/adikosh-upload`;
    }else if (uploadType === "Aldun") {
      return `${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/aldun-upload`;
    }else if (uploadType === "WCTL") {
      return `${import.meta.env.VITE_API_BASE_URL}/api/loan-booking/wctl-upload`;
    } else {
      return;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("⚠️ Please select a file to upload.");
      return;
    }

    if (!uploadType) {
      setError("⚠️ Please select the type of loan.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("lenderType", uploadType);

    try {
      // Send request to backend with progress tracking
      const response = await axios.post(apiEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          // Calculate the percentage of upload progress
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercentage(percentage); // Update the upload percentage state
        },
      });

      setMessage(`✅ ${response.data.message}`);
setError("");
setSkippedRows(response.data.skippedDueToCIBIL || []);

    } catch (error) {
      console.error(
        "❌ Upload error:",
        error.response?.data?.message || error.message
      );

      // Show error message received from backend
      setError(
        `❌ ${
          error.response?.data?.message || "Upload failed. Please try again."
        }`
      );
      setMessage(""); // Clear success message on error
      setUploadPercentage(0); // Reset progress bar on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="loan-booking-container">
      <h2>Upload Loan Booking Excel File</h2>
      <form onSubmit={handleSubmit}>
        <label>File Name (Reference)</label>
        <input
          type="text"
          placeholder="Enter file name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          required
        />

        <label>Select Excel (.xlsx) File</label>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          required
        />

        <label>Select Type of Upload</label>
        <select
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="EV Loan">EV Loan</option>
          <option value="Health Care">Health Care</option>
          <option value="BL Loan">BL Loan</option>
          <option value="GQ FSF">GQ FSF</option>
          <option value="GQ Non-FSF">GQ Non-FSF</option>
          <option value="Adikosh">Adikosh</option>
          {/* <option value="Aldun">Aldun</option> */}
          <option value="WCTL">WCTL</option>
        </select>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Show Success or Error Messages */}
      {message && <p className="upload-message success">{message}</p>}
      {error && <p className="upload-message error">{error}</p>}

      {/* Progress Bar */}
      {uploadPercentage > 0 && (
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${uploadPercentage}%` }}
          ></div>
          <span>{uploadPercentage}%</span>
        </div>
      )}
      {skippedRows.length > 0 && (
  <div className="skipped-section">
    <h3>⚠️ Skipped Records (Low CIBIL Score)</h3>
    <table className="skipped-table">
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>PAN</th>
          <th>Aadhaar</th>
          <th>CIBIL Score</th>
        </tr>
      </thead>
      <tbody>
        {skippedRows.map((row, index) => (
          <tr key={index}>
            <td>{row["Customer Name"]}</td>
            <td>{row["PAN Number"]}</td>
            <td>{row["Aadhaar Number"]}</td>
            <td>{row["Credit Score"]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default CreateLoanBooking;
