// src/pages/TestPage.jsx
import React from 'react';
import CertificateCard from '../components/CertificateCard'; // adjust the path if needed

export default function TestPage() {
  const dummy = {
    _id: 'CERT123',
    treeId: 'TR-001',
    owner: 'John Doe',
    species: 'Aquilaria Malaccensis',
    plantingDate: '2022-05-10',
    status: 'Approved',
    resinQuality: 'A',
    resinYield: 25,
    gpsCoordinates: { latitude: 7.8731, longitude: 80.7718 },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CertificateCard certificate={dummy} showActions={true} />
    </div>
  );
}
