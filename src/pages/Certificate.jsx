import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Certificate = () => {
  const { certificateId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const certificateRef = useRef(null);

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/certificates/harvest/${certificateId}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to load certificate");
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCertificate();
  }, [certificateId]);

  const downloadPDF = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Certificate-${data.certificateNumber}.pdf`);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">❌ {error}</div>;
  if (!data) return null;

  return (
    <div className="container my-5">
      {/* Action Bar */}
      <div className="d-flex justify-content-end mb-4" style={{ maxWidth: "850px", margin: "0 auto" }}>
        <button onClick={downloadPDF} className="btn btn-primary px-4 py-2 shadow-sm">
          <i className="bi bi-download me-2"></i> Download as PDF
        </button>
      </div>

      {/* Modern Certificate UI */}
      <div
        ref={certificateRef}
        className="bg-white shadow-lg mx-auto overflow-hidden"
        style={{
          maxWidth: "850px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        {/* Top Decorative Bar */}
        <div style={{ height: "10px", backgroundColor: "#2d6a4f" }}></div>

        <div className="p-5">
          {/* Header */}
          <div className="row align-items-center mb-5">
            <div className="col-8">
              <h1 className="display-6 fw-bold text-dark mb-1">Harvest Certificate</h1>
              <p className="text-muted text-uppercase ls-wide" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
                Blockchain Verified Digital Asset
              </p>
            </div>
            <div className="col-4 text-end">
               <div className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill border border-success border-opacity-25">
                 {data.status}
               </div>
            </div>
          </div>

          {/* Main Info Box */}
          <div className="bg-light p-4 rounded-3 mb-5 border-start border-4 border-success">
             <h5 className="text-secondary small text-uppercase mb-3">Ownership Details</h5>
             <h3 className="fw-normal mb-1">{data.investor?.name}</h3>
             <p className="text-muted mb-0">{data.investor?.email}</p>
          </div>

          {/* Details Grid */}
          <div className="row g-4 mb-5">
            {[
              { label: "Certificate Number", value: data.certificateNumber },
              { label: "Tree ID", value: data.tree?.treeId },
              { label: "Block Location", value: data.tree?.block },
              { label: "Issue Date", value: new Date(data.createdAt).toLocaleDateString('en-GB') },
              { label: "Lifecycle Status", value: data.tree?.lifecycleStatus },
              { label: "Network", value: data.blockchain?.network.toUpperCase() },
            ].map((item, idx) => (
              <div className="col-md-4 col-6" key={idx}>
                <p className="text-muted small mb-1">{item.label}</p>
                <p className="fw-bold mb-0 text-dark">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Verification Footer */}
          <div className="d-flex align-items-center justify-content-between pt-4 border-top">
            <div>
              <p className="mb-1 fw-bold text-success">
                {data.blockchain?.onChain ? "✓ SECURED BY BLOCKCHAIN" : "PENDING VERIFICATION"}
              </p>
              <small className="text-muted d-block" style={{maxWidth: "300px"}}>
                This document is a digital representation of a biological asset registered on the {data.blockchain?.network} testnet.
              </small>
            </div>
            
            {/* QR Code Placeholder (If you have a URL) */}
            <div className="text-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${data.qrCodeUrl}`} 
                  alt="Verification QR" 
                  className="img-fluid border p-1 bg-white"
                  style={{ width: "80px" }}
                />
                <p className="small text-muted mt-1 mb-0" style={{fontSize: "0.6rem"}}>SCAN TO VERIFY</p>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Bar */}
        <div style={{ height: "4px", backgroundColor: "#e0e0e0" }}></div>
      </div>
    </div>
  );
};

export default Certificate;