import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const Certificate = () => {
  const { investorId } = useParams();
  const [investor, setInvestor] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [chainVerified, setChainVerified] = useState(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef(null);

  // Simple icons as SVG components
  const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );

  const PrinterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        
        // Mock data instead of API calls
        const mockInvestor = {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          investment: "50,000",
          status: "Active",
          createdAt: new Date().toISOString()
        };

        const mockBlock = {
          index: `CERT-${investorId}-001`,
          hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
          data: { action: "Investor Registration" }
        };

        setInvestor(mockInvestor);
        setLatestBlock(mockBlock);
        setChainVerified(true); // Simulate successful verification
        
      } catch (err) {
        console.error("Error loading certificate data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (investorId) load();
  }, [investorId]);

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    alert("PDF download would require jspdf and html2canvas. For now, use Print function and save as PDF from print dialog.");
  };

  // Simple hash function replacement
  const simpleHash = (str) => {
    if (!str) return "—";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).slice(0, 12).toUpperCase();
  };

  const inspectorSignature = (blockHash) => {
    if (!blockHash) return "—";
    return simpleHash(blockHash);
  };

  const certifierSignature = (name) => {
    if (!name) return "—";
    return simpleHash(name);
  };

  // Simple QR code replacement - just a placeholder box
  const QRCodePlaceholder = ({ value }) => (
    <div className="bg-white p-3 rounded border border-gray-300 inline-block">
      <div style={{ 
        width: 140, 
        height: 140, 
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        QR Code<br />Placeholder
      </div>
    </div>
  );

  const verifyBadge = () => {
    if (chainVerified === null) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
          <span>Verification: Unknown</span>
        </div>
      );
    }
    if (chainVerified === true) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600 text-white text-sm font-medium">
          <CheckCircleIcon />
          <span>Verified on Blockchain</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-sm font-medium">
        <span>Blockchain Tampered</span>
      </div>
    );
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-700">Loading certificate...</p>;
  }

  if (!investor || !latestBlock) {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <p className="text-red-600 text-center">
          Certificate data not found.
        </p>
      </div>
    );
  }

  const verificationUrl = `${window.location.origin}/verify/${latestBlock.hash}`;
  const issueDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4 md:p-8">
      {/* Actions (hidden when printing) */}
      <div className="max-w-5xl mx-auto mb-6 print:hidden">
        <div className="flex gap-4 justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            <PrinterIcon /> Print Certificate
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
          >
            <DownloadIcon /> Download PDF
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div
        ref={certificateRef}
        className="max-w-5xl mx-auto bg-white shadow-2xl print:shadow-none border-8 border-double border-amber-600 p-8"
      >
        {/* HEADER */}
        <div className="text-center mb-8 border-b-4 border-green-700 pb-6">
          <div className="flex justify-center mb-4">
            <ShieldIcon />
          </div>

          <h1 className="text-4xl font-bold text-green-800 mb-2">INVESTOR AUTHENTICITY CERTIFICATE</h1>

          <p className="text-xl text-amber-700 font-semibold">Blockchain Verified Investor Record</p>

          <div className="mt-4 inline-block bg-green-100 px-6 py-2 rounded-full">
            <p className="text-sm font-mono text-green-800">Certificate ID: {latestBlock.index}</p>
          </div>

          <div className="mt-3">{verifyBadge()}</div>
        </div>

        {/* Blockchain Verification Panel */}
        <div className="bg-gradient-to-r from-green-50 to-amber-50 p-6 rounded-lg mb-6 border-2 border-green-300">
          <div className="flex items-start gap-4">
            <CheckCircleIcon />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-800 mb-2">Blockchain Verification</h3>
              <p className="text-sm text-gray-600 mb-2">
                This investor record is recorded on the blockchain. Use the QR code or the hash below to verify.
              </p>

              <div className="bg-white p-3 rounded border border-green-200 break-all">
                <p className="text-xs font-mono text-gray-700">{latestBlock.hash}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Info: Investor */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
            <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">👤</span> Investor Information
            </h2>

            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-900">{investor.name}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">{investor.email}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{investor.phone}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="font-medium text-gray-700">Investment:</span>
              <span className="text-gray-900">{investor.investment} USD</span>
            </div>

            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="font-medium text-gray-700">Status:</span>
              <span className="text-gray-900">{investor.status}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">Created:</span>
              <span className="text-gray-900">{new Date(investor.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Blockchain + QR + Signatures */}
          <div className="border-2 border-amber-200 rounded-lg p-6 bg-amber-50 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">🔗</span> Verification & QR
              </h2>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Scan QR Code for Blockchain Verification</p>
                <QRCodePlaceholder value={verificationUrl} />
                <p className="mt-2 text-xs break-all text-gray-600">{verificationUrl}</p>
              </div>

              <div className="mt-4">
                <h3 className="text-sm text-gray-700 mb-2">Block Action</h3>
                <div className="p-3 bg-white rounded border border-amber-100">
                  <p className="font-medium">{latestBlock.data?.action ?? "—"}</p>
                  <p className="text-xs text-gray-500 mt-1">Block Index: {latestBlock.index}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-gray-700 mb-2">Digital Signatures</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded border border-amber-100">
                  <p className="text-xs text-gray-500">Inspector Signature</p>
                  <p className="font-mono font-bold mt-2">{inspectorSignature(latestBlock.hash)}</p>
                </div>

                <div className="p-3 bg-white rounded border border-amber-100">
                  <p className="text-xs text-gray-500">Certifier Signature</p>
                  <p className="font-mono font-bold mt-2">{certifierSignature(investor.name)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Issue date & disclaimer */}
        <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Issue Date:</span> {issueDate}
              </p>
            </div>

            <div className="text-right text-xs text-gray-600 max-w-xs">
              <p>
                This certificate is issued based on the data recorded at the time of block creation. The hash provided
                represents the recorded block. Any alteration invalidates this certificate. Verify via the QR or the
                verification page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* print styles */}
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Certificate;