import React, { useState } from 'react';
import axios from 'axios';

const PredictForm = () => {
  // Define the dropdown options from your encoders
  const eventTypes = [
    { value: 'Wedding', label: 'Wedding' },
    { value: 'Corporate Event', label: 'Corporate Event' },
    { value: 'Engagement Party', label: 'Engagement Party' },
    { value: 'Anniversary', label: 'Anniversary' }
  ];

  const productNames = [
    { value: 'Versailles Chair', label: 'Versailles Chair' },
    { value: 'Surpentine Buffet Table', label: 'Surpentine Buffet Table' },
    { value: 'Red Carpet', label: 'Red Carpet' },
    { value: 'Navy Blue and Yellow Tent', label: 'Navy Blue & Yellow Tent' }
  ];

  const seasonPeriods = [
    { value: '1-4', label: 'January - April' },
    { value: '5-8', label: 'May - August' },
    { value: '9-12', label: 'September - December' }
  ];

  const [formData, setFormData] = useState({
    event_type: '',
    product_name: '',
    quantity: '',
    unit_price: '',
    duration_days: '',
    season_period: '',
    month: '',
    year: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/predict/predict', formData);
      setPrediction(res.data.prediction);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error making prediction. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="bg-red-600 py-4 px-6">
          <h2 className="text-2xl font-bold text-white">Revenue Prediction</h2>
          <p className="text-red-100 mt-1">Fill the form to get revenue prediction</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type Dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Event Type</option>
                {eventTypes.map((event) => (
                  <option key={event.value} value={event.value}>
                    {event.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name Dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <select
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Product</option>
                {productNames.map((product) => (
                  <option key={product.value} value={product.value}>
                    {product.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Season Period Dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Season Period
              </label>
              <select
                name="season_period"
                value={formData.season_period}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Season Period</option>
                {seasonPeriods.map((season) => (
                  <option key={season.value} value={season.value}>
                    {season.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Regular Input Fields */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Unit Price</label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
              <input
                type="number"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <input
                type="number"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                min="1"
                max="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="2000"
                max="2100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-400 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Predicting...
                </>
              ) : 'Predict Revenue'}
            </button>
          </div>
        </form>

        {prediction !== null && (
          <div className="bg-green-50 border-l-4 border-green-600 p-4 mx-6 mb-6 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-black-800">Prediction Result</h3>
                <div className="mt-2 text-sm text-black-700">
                  <p>
                    The predicted revenue is: <span className="font-bold text-xl">LKR {Number(prediction).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictForm;