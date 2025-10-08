import React from 'react';
import { Link } from 'react-router-dom';
import image45 from '../../component/HomePage/image45.jpeg';
import image23 from '../../component/HomePage/image23.jpg';
import image25 from '../../component/HomePage/image25.jpg';
import image16 from '../../component/HomePage/image16.jpeg';

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center px-8 py-8">
      <div className="flex-1 space-y-6">
        <p className="text-sm text-green-600">
          Empowering Smart & Sustainable Agarwood Cultivation with Technology
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Revolutionizing <span className="text-green-600 italic">Agarwood Farming</span> 
          <br />Through IoT, AI & Blockchain
        </h1>
        <p className="text-gray-500">
          Experience the future of precision agriculture. <br />
          Our Decision Support System monitors tree health, predicts resin yield, <br />
          and ensures full transparency from plantation to market.
        </p>
        <div className="flex space-x-4">
          <Link 
            to="/AboutUs" 
            className="bg-green-600 text-white px-6 py-3 rounded-md shadow hover:bg-green-700 transition-colors"
          >
            Explore More
          </Link>
        </div>
      </div>

      {/* Right side images */}
      <div className="flex-1 flex justify-center mt-12 md:mt-0 relative w-full max-w-md h-[400px]">
        <img 
          src={image45} 
          alt="agarwood1" 
          className="absolute top-0 left-0 w-48 h-64 object-cover rounded-xl shadow-lg z-10" 
        />
        <img 
          src={image25} 
          alt="agarwood2" 
          className="absolute top-24 left-16 w-48 h-64 object-cover rounded-xl shadow-lg z-30" 
        />
        <img 
          src={image16} 
          alt="agarwood3" 
          className="absolute top-36 left-44 w-48 h-64 object-cover rounded-xl shadow-lg z-40" 
        />
      </div>
    </section>
  );
};

export default HeroSection;
