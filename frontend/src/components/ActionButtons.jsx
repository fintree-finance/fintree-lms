import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ActionButtons = ({ lan }) => {
  const navigate = useNavigate();

  const handleSOA = async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/documents/generate-soa`,
    { lan: lan }
  );
  if (res.data?.fileUrl) {
    window.open(res.data.fileUrl, "_blank");
  } else {
    alert("SOA generation failed!");
  }

  };

  const handleNOC = async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/documents/generate-noc`,
    { lan: lan }
  );
  if (res.data?.fileUrl) {
    window.open(`${import.meta.env.VITE_API_BASE_URL}${res.data.fileUrl}`, "_blank");
  } else {
    alert("NOC generation failed!");
  }
};



  return (
    <>
      <button onClick={handleSOA}>SOA</button>
      <button onClick={handleNOC}>NOC</button>
    </>
  );
};

export default ActionButtons;
