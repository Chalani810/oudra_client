//path:oudra_client/src/component/TreeMap/TreeMap.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { treeService } from '../../services/treeService';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (SLIIT - Need to adjust to Pintanna plantation)
const defaultCenter = {
  lat: 6.914686,
  lng: 79.972947
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true
};

// Tree marker icons based on health status
const getMarkerIcon = (healthStatus) => {
  const baseUrl = 'http://maps.google.com/mapfiles/ms/icons/';
  
  switch (healthStatus) {
    case 'Healthy':
      return baseUrl + 'green-dot.png';
    case 'Warning':
      return baseUrl + 'yellow-dot.png';
    case 'Damaged':
      return baseUrl + 'orange-dot.png';
    case 'Dead':
      return baseUrl + 'red-dot.png';
    default:
      return baseUrl + 'blue-dot.png';
  }
};

// Color classes matching the consistent color codes
const getHealthStatusColor = (healthStatus) => {
  switch (healthStatus) {
    case 'Healthy':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'Warning':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'Damaged':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    case 'Dead':
      return { bg: 'bg-gray-800', text: 'text-white' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
};

const TreeMap = () => {
  const navigate = useNavigate();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTree, setSelectedTree] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(15);

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const treesData = await treeService.getAllTrees();
      
      /// Filter trees that:
      // 1. Have valid GPS coordinates
      // 2. Are NOT harvested (excluded from live map)
      const activeTreesWithGPS = treesData.filter(tree => 
        tree.gps && 
        tree.gps.lat !== 0 && 
        tree.gps.lng !== 0 &&
        tree.lifecycleStatus !== 'Harvested'
      );
      
      setTrees(activeTreesWithGPS);
      
      // Auto-center map to first tree with GPS
      if (activeTreesWithGPS.length > 0) {
        setMapCenter({
          lat: activeTreesWithGPS[0].gps.lat,
          lng: activeTreesWithGPS[0].gps.lng
        });
      }
    } catch (error) {
      console.error('Error fetching trees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (tree) => {
    setSelectedTree(tree);
  };

  const handleInfoWindowClose = () => {
    setSelectedTree(null);
  };

  const handleViewTree = (treeId) => {
    navigate(`/treeprofile/${treeId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={mapOptions}
      >
        {trees.map((tree) => (
          <Marker
            key={tree._id}
            position={{
              lat: tree.gps.lat,
              lng: tree.gps.lng
            }}
            onClick={() => handleMarkerClick(tree)}
            icon={{
              url: getMarkerIcon(tree.healthStatus),
              scaledSize: window.google?.maps ? new window.google.maps.Size(32, 32) : undefined
            }}
            title={tree.treeId}
          />
        ))}

        {selectedTree && (
          <InfoWindow
            position={{
              lat: selectedTree.gps.lat,
              lng: selectedTree.gps.lng
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{selectedTree.treeId}</h3>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Health:</span>
                  <span className={`font-semibold ${getHealthStatusColor(selectedTree.healthStatus).text}`}>
                    {selectedTree.healthStatus}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Block:</span>
                  <span className="font-semibold">{selectedTree.block || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Lifecycle:</span>
                  <span className="font-semibold text-xs">{selectedTree.lifecycleStatus}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Inoculations:</span>
                  <span className="font-semibold">{selectedTree.inoculationCount}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleViewTree(selectedTree.treeId)}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default TreeMap;