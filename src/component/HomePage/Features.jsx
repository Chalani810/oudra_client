import React, { useState } from 'react';
import cateringImg from '../../component/HomePage/image46.jpg';
import planningImg from '../../component/HomePage/image30.png';
import venueImg from '../../component/HomePage/image10.webp';
import audiovisual from '../../component/HomePage/image38.jpg';
import lightning from '../../component/HomePage/image39.jpg';
import tentcanopy from '../../component/HomePage/image40.jpg';
import tableglassware from '../../component/HomePage/image30.png';
import floorstaging from '../../component/HomePage/image42.jpg';
import heatingcooling from '../../component/HomePage/image43.jpg';
import photobooth from '../../component/HomePage/image44.jpg';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 

const Features = () => {

  const allFeatures = [
    {
      title: "IoT-Based Smart Monitoring",
      description: "Each agarwood tree is equipped with a smart sensor node that measures soil moisture, temperature, humidity, and pH to track real-time growth conditions.",
      image: cateringImg,
    },
    {
      title: "AI-Powered Resin Detection",
      description: "Our AI model uses image analysis to identify resin-rich zones without cutting into the tree—ensuring a non-invasive, sustainable cultivation process.",
      image: planningImg,
    },
    {
      title: "Blockchain Traceability System",
      description: "Every tree’s lifecycle data—from planting to harvest—is securely recorded on a blockchain, enabling transparent tracking and authenticity verification.",
      image: venueImg,
    },
    {
      title: "Data Visualization Dashboard",
      description: "A cloud-based dashboard built with MERN stack provides visual insights, sensor data charts, and alerts for managers to make quick, data-driven decisions.",
      image: audiovisual, 
    },
    {
      title: "Automated Field Task Alerts",
      description: "The system automatically sends real-time alerts and task notifications to field workers through a connected mobile app when irregularities are detected.",
      image: lightning, 
    },
    {
      title: "Sustainable Cultivation Support",
      description: "By analyzing environmental conditions, the system optimizes irrigation, fertilizer usage, and disease prevention, promoting eco-friendly agarwood growth.",
      image: tentcanopy, 
    },
    {
      title: "Research & Pilot Deployment",
      description: "The system has been successfully tested at Pintanna’s Ayagama Estate, showing improved resin yield, early disease detection, and efficient data handling.",
      image: tableglassware,
    },
    {
      title: "Real-Time Decision Support",
      description: "The platform provides predictive analytics for growth patterns, enabling managers to plan harvests and resource allocation more efficiently.",
      image: floorstaging,
    },
    {
      title: "Mobile App for Field Operations",
      description: "Built with React Native, the mobile app allows workers to receive live instructions, upload field images, and sync sensor data with the cloud in real time.",
      image: heatingcooling, 
    },
    {
      title: "Transparent Supply Chain",
      description: "Buyers and regulators can verify product origin, quality, and history through blockchain certificates—ensuring trust from plantation to market.",
      image: photobooth, 
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const currentFeatures = allFeatures.slice(currentIndex, currentIndex + itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsPerPage >= allFeatures.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? allFeatures.length - itemsPerPage : prevIndex - 1
    );
  };

  return (
    <section className="px-8 py-8 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          Explore the <span className="text-green-600">Oudra Features</span>
        </h2>
      </div>
      
      <div className="relative flex items-center justify-center">
        <button 
          onClick={prevSlide}
          className="absolute left-0 z-10 p-2 text-green-700 hover:text-green-500 focus:outline-none"
          aria-label="Previous items"
        >
          <FaChevronLeft size={24} />
        </button>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center w-full">
          {currentFeatures.map((feature, idx) => (
            <div key={idx} className="max-w-sm p-6 bg-white rounded-lg shadow-md text-center">
              <img 
                src={feature.image} 
                alt={feature.title} 
                className="w-full h-40 object-cover rounded-md mb-4" 
              />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="absolute right-0 z-10 p-2 text-green-700 hover:text-green-500 focus:outline-none"
          aria-label="Next items"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default Features;
