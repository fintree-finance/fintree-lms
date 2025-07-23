import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import "../styles/foreclosureUpload.css";

const ForecloserUpload = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setMessage("");
    setIsError(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(ws);
      setPreviewData(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);

    setIsUploading(true);
    setUploadPercentage(0);
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/forecloser/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadPercentage(percent);
        },
      });

      setMessage("✅ Upload successful");
      setIsError(false);
      setFile(null);
    } catch (err) {
      console.error("❌ Upload failed", err);
      setMessage("❌ Upload failed. Please try again.");
      setIsError(true);
      setUploadPercentage(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="forecloser-upload-container">
      <h4 className="forecloser-upload-title">📤 Foreclosure & Charge Collection Upload</h4>

      <input
        type="file"
        className="forecloser-upload-input"
        accept=".xlsx, .xls"
        onChange={handleFile}
      />

      <button className="forecloser-upload-button" onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {uploadPercentage > 0 && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${uploadPercentage}%` }}></div>
          <span>{uploadPercentage}%</span>
        </div>
      )}

      {message && (
        <p className={isError ? "error-message" : "success-message"}>{message}</p>
      )}

      {/* 
      Uncomment below to show preview
      {previewData.length > 0 && (
        <div className="forecloser-table-wrapper">
          <table className="forecloser-preview-table">
            <thead>
              <tr>
                {Object.keys(previewData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      */}
    </div>
  );
};

export default ForecloserUpload;
