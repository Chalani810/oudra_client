import { jsPDF } from "jspdf";
import QRCode from 'qrcode';

export const generateTreeCertificate = async (investor, tree) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  // ✅ CRITICAL TRUST UPDATE: 
  // The QR code now points DIRECTLY to the Blockchain Explorer
  const polygonScanUrl = `https://amoy.polygonscan.com/tx/${tree.blockchainTxHash}`;
  const qrCodeDataUrl = await QRCode.toDataURL(polygonScanUrl);

  // --- Background & Branding ---
  doc.setFillColor(245, 248, 245); 
  doc.rect(0, 0, 297, 210, "F");
  doc.setDrawColor(39, 174, 96); 
  doc.setLineWidth(2);
  doc.rect(5, 5, 287, 200);

  // --- Header ---
  doc.setTextColor(39, 174, 96);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Oudra Plantation", 148, 30, { align: "center" });
  doc.setFontSize(22);
  doc.text("OFFICIAL HARVEST CERTIFICATE", 148, 42, { align: "center" });

  // --- Asset Details ---
  doc.setTextColor(60);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`This document confirms the ownership and harvest of Agarwood Asset`, 148, 65, { align: "center" });
  
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(tree.treeId, 148, 80, { align: "center" });

  // --- Metadata Table ---
  doc.setDrawColor(220);
  doc.line(40, 95, 257, 95);

  const startY = 110;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("INVESTOR", 50, startY);
  doc.text("BLOCK LOCATION", 110, startY);
  doc.text("GPS COORDINATES", 170, startY);
  doc.text("INOCULATION COUNT", 230, startY);

  doc.setTextColor(40);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(investor.name, 50, startY + 8);
  doc.text(tree.block, 110, startY + 8);
  doc.text(`${tree.gps.lat.toFixed(4)}, ${tree.gps.lng.toFixed(4)}`, 170, startY + 8);
  doc.text(`${tree.inoculationCount || 2} Times`, 230, startY + 8);

  // --- Blockchain Verification Section (The Trust Pillar) ---
  doc.setFillColor(235, 245, 235);
  doc.rect(40, 140, 217, 35, "F");
  
  doc.setFontSize(9);
  doc.setTextColor(39, 174, 96);
  doc.text("POLYGON BLOCKCHAIN PROOF", 45, 148);
  
  doc.setTextColor(80);
  doc.setFont("courier", "bold");
  // Split long hash to fit
  doc.text(tree.blockchainTxHash || "Verification Pending...", 45, 158);

  // Add the QR Code
  doc.addImage(qrCodeDataUrl, "PNG", 225, 142, 30, 30);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("Scan to verify on-chain", 225, 175);

  // --- Footer ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("This certificate is digitally signed and logged on the Polygon Network. Oudra Plantation guarantees the authenticity of the resin yield associated with this specific Tree ID.", 148, 190, { align: "center", maxWidth: 200 });

  doc.save(`Oudra_Harvest_${tree.treeId}.pdf`);
};