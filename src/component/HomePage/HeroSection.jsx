import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import image45 from '../../component/HomePage/image45.jpeg';
import image23 from '../../component/HomePage/image23.jpg';
import image25 from '../../component/HomePage/image25.jpg';
import image16 from '../../component/HomePage/image16.jpeg';

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center px-8 py-8">
      <div className="flex-1 space-y-6">
        <p className="text-sm text-red-500">Everything You Need to Host Unforgettable Events,All in One Place.</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Plan & Host Spectacular <span className="text-red-500 italic">Moments</span>, With Us
        </h1>
        <p className="text-gray-400">
          Don't wait!<br /> It's time to bring your dream event to life! <br />From corporate gatherings to grand celebrations, we make every occasion special.
        </p>
        <div className="flex space-x-4">
          <Link 
            to="/AboutUs" 
            className="bg-red-500 text-white px-6 py-3 rounded-md shadow hover:bg-red-600 transition-colors"
          >
            Explore More
          </Link>
        </div>
      </div>

      {/* Right side images */}
      <div className="flex-1 flex justify-center mt-12 md:mt-0 relative w-full max-w-md h-[400px]">
        <img 
          src={image45} 
          alt="event1" 
          className="absolute top-0 left-0 w-48 h-64 object-cover rounded-xl shadow-lg z-10" 
        />
        <img 
          src={image25} 
          alt="event3" 
          className="absolute top-24 left-16 w-48 h-64 object-cover rounded-xl shadow-lg z-30" 
        />
        <img 
          src={image16} 
          alt="event4" 
          className="absolute top-36 left-44 w-48 h-64 object-cover rounded-xl shadow-lg z-40" 
        />
      </div>

    </section>
  );
};

export default HeroSection;