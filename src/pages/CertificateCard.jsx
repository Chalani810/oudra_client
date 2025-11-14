// CertificateCard.jsx
import { useState } from 'react';
import {
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  FileText,
  User,
  Navigation,
} from 'lucide-react';

const CertificateCard = ({ certificate, language = 'en', showActions = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!certificate) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-center">
        No certificate data available.
      </div>
    );
  }

  const translations = {
    en: {
      planted: 'Planted',
      inoculated: 'Inoculated',
      harvested: 'Harvested',
      resinQuality: 'Resin Quality',
      resinYield: 'Resin Yield',
      viewDetails: 'View Details',
      downloadPDF: 'Download PDF',
      approve: 'Approve',
      revoke: 'Revoke',
      owner: 'Owner',
      species: 'Species',
      location: 'Location',
      status: 'Status',
      viewMore: 'View More',
      viewLess: 'View Less',
      issuedDate: 'Issued Date',
      approvedBy: 'Approved By',
      viewOnMap: 'View on Map',
      generateCertificate: 'Generate Certificate',
    },
    si: {
      planted: 'පැල කළ දිනය',
      inoculated: 'Inoculated දිනය',
      harvested: 'Harvested දිනය',
      resinQuality: 'රා විලාසිතාව',
      resinYield: 'රා අස්වැන්න',
      viewDetails: 'විස්තර බලන්න',
      downloadPDF: 'PDF බාගන්න',
      approve: 'අනුමත කරන්න',
      revoke: 'අවලංගු කරන්න',
      owner: 'හිමිකරු',
      species: 'විශේෂය',
      location: 'ස්ථානය',
      status: 'තත්වය',
      viewMore: 'තවත් බලන්න',
      viewLess: 'අඩුවෙන් බලන්න',
      issuedDate: 'නිකුත් කළ දිනය',
      approvedBy: 'අනුමත කළේ',
      viewOnMap: 'සිතියමේ බලන්න',
      generateCertificate: 'සහතිකය ජනනය කරන්න',
    },
  };

  const t = translations[language];

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: { en: 'Pending', si: 'පොරොත්තු' }, icon: '⏳' },
      Approved: { color: 'bg-green-100 text-green-800 border-green-200', label: { en: 'Approved', si: 'අනුමත' }, icon: '✅' },
      Revoked: { color: 'bg-red-100 text-red-800 border-red-200', label: { en: 'Revoked', si: 'අවලංගු' }, icon: '❌' },
    };
    const config = statusConfig[status] || statusConfig.Pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <span>{config.icon}</span>
        {config.label[language]}
      </span>
    );
  };

  const getResinQualityColor = (quality) => {
    switch (quality) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'C': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'D': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">🌳</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{certificate.treeId}</h3>
                <p className="text-sm text-gray-600">{certificate.species}</p>
              </div>
            </div>
            <StatusBadge status={certificate.status} />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User size={16} className="text-gray-400" />
              <span><strong className="font-medium text-gray-700">{t.owner}:</strong> {certificate.owner || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} className="text-gray-400" />
              <span><strong className="font-medium text-gray-700">{t.planted}:</strong> {certificate.plantingDate ? new Date(certificate.plantingDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-gray-400" />
              <span><strong className="font-medium text-gray-700">{t.location}:</strong> {certificate.gpsCoordinates ? `${certificate.gpsCoordinates.latitude?.toFixed(4)}, ${certificate.gpsCoordinates.longitude?.toFixed(4)}` : 'N/A'}</span>
            </div>
            {certificate.resinQuality && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">{t.resinQuality}:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getResinQualityColor(certificate.resinQuality)}`}>Grade {certificate.resinQuality}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-row lg:flex-col gap-2 flex-wrap">
            {certificate.status === 'Pending' && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  <CheckCircle size={16} /> {t.approve}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  <XCircle size={16} /> {t.revoke}
                </button>
              </>
            )}
            <button className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
              <Download size={16} /> {t.downloadPDF}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <Eye size={16} /> {t.viewDetails}
            </button>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-2"
        >
          {isExpanded ? t.viewLess : t.viewMore}
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            {/* Lifecycle */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wide">{language === 'en' ? 'Lifecycle Events' : 'ජීවන චක්‍ර සිදුවීම්'}</h4>
              <div><strong>{t.planted}:</strong> {certificate.plantingDate ? new Date(certificate.plantingDate).toLocaleDateString() : 'N/A'}</div>
              {certificate.inoculationDate && <div><strong>{t.inoculated}:</strong> {new Date(certificate.inoculationDate).toLocaleDateString()}</div>}
              {certificate.harvestDate && <div><strong>{t.harvested}:</strong> {new Date(certificate.harvestDate).toLocaleDateString()}</div>}
              {certificate.issuedDate && <div><strong>{t.issuedDate}:</strong> {new Date(certificate.issuedDate).toLocaleDateString()}</div>}
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wide">{language === 'en' ? 'Quality Metrics' : 'ගුණාත්මක මිණුම්'}</h4>
              {certificate.resinQuality && (
                <div className="flex items-center gap-2">
                  <strong>{t.resinQuality}:</strong>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getResinQualityColor(certificate.resinQuality)}`}>Grade {certificate.resinQuality}</span>
                </div>
              )}
              {certificate.resinYield && <div><strong>{t.resinYield}:</strong> {certificate.resinYield}g</div>}
              {certificate.qualityScore && <div><strong>{language === 'en' ? 'Quality Score:' : 'ගුණාත්මක ලකුණු:'}</strong> {certificate.qualityScore}/100</div>}
            </div>

            {/* Administrative */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wide">{language === 'en' ? 'Administrative' : 'පරිපාලන'}</h4>
              {certificate.approvedBy && <div><strong>{t.approvedBy}:</strong> {certificate.approvedBy}</div>}
              {certificate.gpsCoordinates && (
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs">
                  <Navigation size={12} /> {t.viewOnMap}
                </button>
              )}
              <button className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs">
                <FileText size={12} /> {t.generateCertificate}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FileText size={12} /> {language === 'en' ? 'Certificate ID:' : 'සහතික ID:'} {certificate._id || 'N/A'}
        </div>
        <div className="flex gap-2">
          {certificate.gpsCoordinates && (
            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <MapPin size={12} /> {t.location}
            </button>
          )}
          <button className="text-xs text-gray-600 hover:text-gray-700 flex items-center gap-1">
            <Eye size={12} /> {t.viewDetails}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
