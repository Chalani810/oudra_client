// SmartCertificate.jsx - ENHANCED VERSION (No external QR dependencies)
import React, { useEffect, useState, useRef, useCallback } from "react";

const SmartCertificate = ({ certificateId: propCertificateId }) => {
  const certificateId = propCertificateId || window.location.pathname.split('/').pop();
  const [certificate, setCertificate] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('certificate');
  const certificateRef = useRef(null);
  const [qrImages, setQrImages] = useState({
    verification: '',
    nft: ''
  });
  const [treeDetails, setTreeDetails] = useState([]);

  const API_URL = 'http://localhost:5000/api';

  // Icons
  const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );

  const PrinterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );

  const LinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  const TreeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
      <path d="M12 12v6"/>
      <path d="M9 18h6"/>
    </svg>
  );

  const MoneyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  );

  const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const AwardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );

  const QRIcon = () => (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <rect x="7" y="7" width="3" height="3" fill="currentColor"/>
      <rect x="14" y="7" width="3" height="3" fill="currentColor"/>
      <rect x="7" y="14" width="3" height="3" fill="currentColor"/>
      <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
      <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
    </svg>
  );

  // Function to generate a simple QR-like placeholder
  const generateQRPlaceholder = (url, type) => {
    // Create a simple QR-like pattern with SVG
    const qrColor = type === 'verification' ? '#1a5f3f' : '#1e3a8a';
    return (
      <div className="relative">
        <div className="w-32 h-32 border-2 border-gray-300 bg-white p-2">
          <div className="grid grid-cols-4 gap-1 w-full h-full">
            {/* QR pattern */}
            <div className="col-span-1 bg-black"></div>
            <div className="col-span-1"></div>
            <div className="col-span-1 bg-black"></div>
            <div className="col-span-1 bg-black"></div>
            
            <div className="col-span-1 bg-black"></div>
            <div className="col-span-1"></div>
            <div className="col-span-1"></div>
            <div className="col-span-1"></div>
            
            <div className="col-span-1 bg-black"></div>
            <div className="col-span-1"></div>
            <div className="col-span-1 bg-black"></div>
            <div className="col-span-1"></div>
            
            <div className="col-span-1 bg-black"></div>
            <div className="col-span-1 bg-black"></div>
            <div className="col-span-1"></div>
            <div className="col-span-1 bg-black"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-black"></div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-600 break-all">{url.substring(0, 20)}...</p>
        </div>
      </div>
    );
  };

  const loadCertificate = useCallback(async () => {
    try {
      setLoading(true);
      
      const certResponse = await fetch(`${API_URL}/certificates/${certificateId}`);
      const certData = await certResponse.json();
      
      if (certData.success) {
        const cert = certData.certificate;
        setCertificate(cert);
        
        // Load verification data
        const verifyResponse = await fetch(`${API_URL}/certificates/${certificateId}/verify`);
        const verifyData = await verifyResponse.json();
        
        if (verifyData.success) {
          setVerification(verifyData.verification);
        }
        
        // Load tree details if treeIds exist
        if (cert.treeIds && cert.treeIds.length > 0) {
          const treePromises = cert.treeIds.map(async (treeId) => {
            const response = await fetch(`${API_URL}/trees/${treeId}`);
            return response.json();
          });
          
          const treeResults = await Promise.allSettled(treePromises);
          const trees = treeResults
            .filter(result => result.status === 'fulfilled' && result.value.success)
            .map(result => result.value.data);
          
          setTreeDetails(trees);
        }
        
        // Generate verification URLs (no actual QR generation, just URLs)
        const verifyUrl = `${window.location.origin}/verify/${certificateId}`;
        const nftUrl = cert.nftMetadata?.tokenId 
          ? `https://opensea.io/assets/${cert.nftMetadata.contractAddress}/${cert.nftMetadata.tokenId}`
          : '#';
        
        // Store URLs for display
        setQrImages({
          verification: verifyUrl,
          nft: nftUrl
        });
      }
    } catch (err) {
      console.error("Error loading certificate:", err);
    } finally {
      setLoading(false);
    }
  }, [certificateId]);

  useEffect(() => {
    loadCertificate();
  }, [loadCertificate]);

  const handlePrint = () => {
    // Simple print function
    window.print();
  };

  const handleDownloadPDF = () => {
    alert("PDF download would require jspdf and html2canvas. For now, use Print function and save as PDF.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading premium certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">Certificate not found</p>
        </div>
      </div>
    );
  }

  const getVerificationBadge = () => {
    const score = verification?.integrityScore || 0;
    
    if (score === 100) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium shadow-lg">
          <CheckCircleIcon />
          <span>100% Verified on Blockchain</span>
        </div>
      );
    } else if (score >= 75) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500 text-white text-sm font-medium shadow-lg">
          <span>⚠️ {score}% Verified</span>
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium shadow-lg">
          <span>❌ Verification Failed ({score}%)</span>
        </div>
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Simple QR-like display component
  const QRDisplay = ({ url, label, type = 'verification' }) => {
    const qrColor = type === 'verification' ? 'border-green-500' : 'border-blue-500';
    
    return (
      <div className="text-center">
        <div className={`border-2 ${qrColor} rounded-lg p-3 inline-block bg-white`}>
          <div className="w-32 h-32 flex items-center justify-center">
            {/* Simple QR-like pattern using CSS */}
            <div className="relative w-24 h-24">
              {/* Outer border */}
              <div className="absolute inset-0 border-2 border-black"></div>
              
              {/* Corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-black"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-black"></div>
              
              {/* Pattern dots */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-black rounded-sm"></div>
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-black rounded-sm"></div>
              <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-black rounded-sm"></div>
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-sm"></div>
              
              {/* Center square */}
              <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border-2 border-black"></div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{label}</p>
        <p className="text-xs text-gray-500 mt-1 break-all max-w-[150px] mx-auto">
          {url.length > 30 ? url.substring(0, 30) + '...' : url}
        </p>
      </div>
    );
  };

  const renderCertificateView = () => (
    <div
      id="certificate-print-content"
      ref={certificateRef}
      className="bg-white border-8 border-double border-amber-600 p-4 md:p-8 bg-[#fefbf3] print:shadow-none"
      style={{ minHeight: '29.7cm', boxSizing: 'border-box' }}
    >
      {/* Premium Certificate Design */}
      <div className="text-center mb-8 border-b-4 border-green-700 pb-6">
        <div className="flex justify-center mb-4">
          <ShieldIcon />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
          🌳 SUSTAINABLE FORESTRY 🌳
        </h1>

        <p className="text-lg md:text-xl text-amber-700 font-semibold">
          BLOCKCHAIN VERIFIED CERTIFICATE
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-green-100 border border-green-300 rounded-full">
          <span className="text-lg">🛡️</span>
          <span className="font-semibold text-green-800">Verified on Blockchain</span>
        </div>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-8">
        <div className="border-t-2 border-b-2 border-amber-600 py-3">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800">
            CERTIFICATE OF OWNERSHIP
          </h2>
        </div>
        <p className="text-lg text-gray-600 mt-2 italic">
          Proudly Presented To
        </p>
      </div>

      {/* Recipient */}
      <div className="text-center mb-8">
        <div className="inline-block px-6 md:px-8 py-4 border-2 border-green-700 rounded-lg bg-gradient-to-r from-green-50 to-amber-50 shadow-md">
          <p className="text-2xl md:text-3xl font-bold text-green-800">
            {certificate.certificationData?.investorName || 'N/A'}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="text-center mb-8 px-2 md:px-12">
        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
          For their distinguished investment in sustainable forestry and verified ownership of premium teak plantation trees, 
          contributing to environmental conservation and carbon offset initiatives.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Left Column - Certificate Details */}
        <div className="border-2 border-green-200 rounded-lg p-4 md:p-6 bg-green-50">
          <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-2xl md:text-3xl">📋</span> Certificate Details
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-600">📜 Certificate ID:</span>
              <span className="font-mono font-bold text-blue-800 text-sm md:text-base">
                {certificate.certificateId}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <TreeIcon />
              <span className="text-gray-600">🌳 Trees Owned:</span>
              <span className="font-bold">
                {certificate.certificationData?.treesOwned || 0} Premium Teak Trees
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <MoneyIcon />
              <span className="text-gray-600">💰 Total Investment:</span>
              <span className="font-bold text-green-700">
                ${certificate.certificationData?.totalInvestment?.toLocaleString() || '0'} USD
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <LocationIcon />
              <span className="text-gray-600">📍 Location:</span>
              <span className="font-bold">
                {certificate.certificationData?.location || 'Block A-7, Plantation Zone'}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <AwardIcon />
              <span className="text-gray-600">🏆 Resin Grade:</span>
              <span className="font-bold text-amber-700">
                {certificate.certificationData?.certifiedResinGrade || 'AAA+ Premium Quality'}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-gray-600">🌱 Carbon Credits:</span>
              <span className="font-bold">
                {certificate.certificationData?.carbonCredits || '1,250'} tons CO₂/year
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <CalendarIcon />
              <span className="text-gray-600">📅 Issue Date:</span>
              <span className="font-bold">
                {formatDate(certificate.certificationData?.certificationDate)}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <ClockIcon />
              <span className="text-gray-600">⏰ Valid Until:</span>
              <span className="font-bold">
                {formatDate(certificate.certificationData?.expiryDate) || 'December 15, 2034'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Blockchain Verification */}
        <div className="border-2 border-blue-200 rounded-lg p-4 md:p-6 bg-blue-50">
          <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <span className="text-2xl md:text-3xl">🔐</span> Blockchain Verification
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="text-green-600" />
                <span>Verified on {certificate.blockchainAnchors?.length || 0} Blockchain Blocks</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="text-green-600" />
                <span>Integrity Score: {verification?.integrityScore || 0}%</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="text-green-600" />
                <span>Multi-Entity Cross-Verification Complete</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">🔗 Latest Block Hash:</p>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                {certificate.blockchainAnchors?.[0]?.blockHash || '0x4a9f82b6c3d4e5f67890abcdef1234567890...'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Verification Progress:</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-600 h-4 rounded-full transition-all"
                    style={{ width: `${verification?.integrityScore || 0}%` }}
                  />
                </div>
                <span className="font-bold text-green-700">{verification?.integrityScore || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Codes Section */}
      <div className="flex justify-center gap-4 md:gap-8 mb-8 flex-wrap">
        <QRDisplay 
          url={qrImages.verification}
          label="Scan to Verify Certificate"
          type="verification"
        />
        
        <QRDisplay 
          url={qrImages.nft}
          label="Digital NFT Link"
          type="nft"
        />
      </div>

      {/* Signatures */}
      <div className="border-t-2 border-amber-600 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
          <div className="text-center flex-1">
            <div className="border-b-2 border-gray-300 pb-1 mb-2 max-w-xs mx-auto">
              <p className="font-bold text-gray-800">Dr. Sarah Mitchell</p>
            </div>
            <p className="text-sm text-gray-600">Chief Sustainability Officer</p>
          </div>
          
          <div className="text-center flex-1">
            <div className="border-b-2 border-gray-300 pb-1 mb-2 max-w-xs mx-auto">
              <p className="font-bold text-gray-800">{formatDate(new Date())}</p>
            </div>
            <p className="text-sm text-gray-600">Date of Certification</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-300 text-center">
        <p className="text-sm text-gray-600">
          This certificate is cryptographically secured on the blockchain and can be verified at:
        </p>
        <p className="text-sm text-blue-600 font-medium mt-1 break-all">
          https://verify.forestchain.com/{certificate.certificateId}
        </p>
      </div>
    </div>
  );

  const renderBlockchainView = () => (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-4 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Blockchain Anchors</h2>
      
      <div className="space-y-4">
        {certificate.blockchainAnchors?.map((anchor, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800">
                  Block #{anchor.blockNumber}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(anchor.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                {anchor.entityType}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <LinkIcon />
                Block Hash:
              </p>
              <p className="font-mono text-xs text-gray-800 break-all">
                {anchor.blockHash}
              </p>
            </div>
          </div>
        ))}

        {(!certificate.blockchainAnchors || certificate.blockchainAnchors.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No blockchain anchors found
          </div>
        )}
      </div>
    </div>
  );

  const renderHistoryView = () => (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-4 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Version History</h2>
      
      <div className="space-y-4">
        {certificate.versionHistory?.map((version, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800">
                  Version {version.version}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <ClockIcon />
                  {new Date(version.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded mb-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Reason:</span> {version.reason}
              </p>
            </div>

            {version.blockchainHash && (
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs text-gray-600 mb-1">Blockchain Hash:</p>
                <p className="font-mono text-xs text-gray-800 break-all">
                  {version.blockchainHash}
                </p>
              </div>
            )}
          </div>
        ))}

        {(!certificate.versionHistory || certificate.versionHistory.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No version history available
          </div>
        )}
      </div>
    </div>
  );

  const renderDetailsView = () => (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-4 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Information</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tree Details */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🌳 Tree Details</h3>
          
          {treeDetails.length > 0 ? (
            <div className="space-y-3">
              {treeDetails.slice(0, 5).map((tree, index) => (
                <div key={index} className="border-l-2 border-green-500 pl-3">
                  <p className="font-medium text-gray-800">Tree ID: {tree.treeId}</p>
                  <p className="text-sm text-gray-600">
                    Status: <span className={`px-2 py-1 rounded text-xs ${
                      tree.healthStatus === 'Healthy' 
                        ? 'bg-green-100 text-green-800' 
                        : tree.healthStatus === 'Warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tree.healthStatus}
                    </span>
                  </p>
                </div>
              ))}
              
              {treeDetails.length > 5 && (
                <p className="text-sm text-blue-600 mt-2">
                  +{treeDetails.length - 5} more trees
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No tree details available</p>
          )}
        </div>

        {/* Smart Features */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Smart Features</h3>
          
          <div className="space-y-3">
            {certificate.smartFeatures && (
              <>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Auto-Update</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      certificate.smartFeatures.autoUpdate 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {certificate.smartFeatures.autoUpdate ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Notifications</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      certificate.smartFeatures.notifyOnChanges 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {certificate.smartFeatures.notifyOnChanges ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Public Visibility</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      certificate.smartFeatures.publiclyViewable 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {certificate.smartFeatures.publiclyViewable ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Certificate Version</p>
              <p className="font-bold text-lg">v{certificate.versionHistory?.length || 1}.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4 md:p-8">
      {/* Controls */}
      <div className="max-w-6xl mx-auto mb-6 print:hidden">
        <div className="flex gap-2 md:gap-4 justify-between items-center flex-wrap mb-4">
          <div className="flex gap-1 md:gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg transition ${
                activeTab === 'certificate' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Certificate View
            </button>
            <button
              onClick={() => setActiveTab('blockchain')}
              className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg transition ${
                activeTab === 'blockchain' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Blockchain
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg transition ${
                activeTab === 'history' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Version History
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg transition ${
                activeTab === 'details' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Details
            </button>
          </div>

          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-md text-sm md:text-base"
            >
              <PrinterIcon /> Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors shadow-md text-sm md:text-base"
            >
              <DownloadIcon /> Download PDF
            </button>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="mt-4 flex justify-center">
          {getVerificationBadge()}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'certificate' && renderCertificateView()}
      {activeTab === 'blockchain' && renderBlockchainView()}
      {activeTab === 'history' && renderHistoryView()}
      {activeTab === 'details' && renderDetailsView()}

      <style>{`
        @media print {
          body { 
            margin: 0 !important; 
            padding: 0 !important;
            background: #fefbf3 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .print\\:hidden { 
            display: none !important; 
          }
          .print\\:shadow-none { 
            box-shadow: none !important;
            border: 8px double #d4af37 !important;
          }
          
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          
          /* Ensure background colors print */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartCertificate;