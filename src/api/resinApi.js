// src/api/resinApi.js

// Mock data for development
const mockAnalysisData = {
  id: 'analysis_001',
  treeId: 'T-01962',
  resinScore: 85,
  riskLevel: 'high',
  modelConfidence: 92.5,
  modelVersion: 'v2.1.3',
  timestamp: '2024-01-15T10:30:00Z',
  heatmapUrl: 'https://images.unsplash.com/photo-1574269868300-6dc84d7c929d?w=800&h=600&fit=crop',
  originalImageUrl: 'https://images.unsplash.com/photo-1574269868300-6dc84d7c929d?w=800&h=600&fit=crop',
  aiOverlayUrl: 'https://images.unsplash.com/photo-1574269868300-6dc84d7c929d?w=800&h=600&fit=crop',
  spreadPattern: 'Concentrated in upper trunk',
  recommendedAction: 'Schedule extraction in 2 weeks',
  workerNotes: 'Tree shows healthy resin flow, no signs of disease'
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Core API functions
export const fetchAnalysisByTreeId = async (treeId) => {
  await delay(800);
  return {
    ...mockAnalysisData,
    treeId: treeId,
    resinScore: Math.floor(Math.random() * 30) + 70,
    riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
  };
};

export const fetchAnalysisById = async (analysisId) => {
  await delay(600);
  return {
    ...mockAnalysisData,
    id: analysisId,
    resinScore: Math.floor(Math.random() * 100),
    riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)]
  };
};

export const fetchHistoryByTreeId = async (treeId) => {
  await delay(600);
  return [
    {
      id: 'history_001',
      treeId: treeId,
      resinScore: 82,
      riskLevel: 'high',
      timestamp: '2024-01-08T14:20:00Z',
      originalImageUrl: 'https://images.unsplash.com/photo-1574269868300-6dc84d7c929d?w=200&h=150&fit=crop',
      heatmapUrl: 'https://images.unsplash.com/photo-1574269868300-6dc84d7c929d?w=200&h=150&fit=crop',
      aiOverlayUrl: 'https://images.unsplash.com/photo-1574269868300-6dc84d7c929d?w=200&h=150&fit=crop',
      workerId: 'worker_001',
      workerName: 'AVA Card'
    }
  ];
};

export const downloadAnalysisReport = async (analysisId, format = 'pdf') => {
  await delay(2000);
  return { 
    success: true, 
    url: `/reports/analysis_${analysisId}.${format}`,
    message: `Report generated successfully in ${format.toUpperCase()} format`
  };
};

// Comprehensive API object
export const resinApi = {
  getAnalysisByTreeId: fetchAnalysisByTreeId,
  getAnalysisById: fetchAnalysisById,
  getAnalysisHistory: fetchHistoryByTreeId,
  downloadReport: downloadAnalysisReport,
  
  // Utility
  healthCheck: async () => {
    await delay(300);
    return { status: 'healthy', timestamp: new Date().toISOString() };
  }
};

export default resinApi;