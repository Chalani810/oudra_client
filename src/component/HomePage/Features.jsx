import React, { useState } from 'react';
import cateringImg from '../../component/HomePage/image30.jpg';
import planningImg from '../../component/HomePage/image37.jpg';
import venueImg from '../../component/HomePage/image10.jpg';
import audiovisual from '../../component/HomePage/image38.jpg';
import lightning from '../../component/HomePage/image39.jpg';
import tentcanopy from '../../component/HomePage/image40.jpg';
import tableglassware from '../../component/HomePage/image41.jpg';
import floorstaging from '../../component/HomePage/image42.jpg';
import heatingcooling from '../../component/HomePage/image43.jpg';
import photobooth from '../../component/HomePage/image44.jpg';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 

const Features = () => {

  // All rental items
  const allFeatures = [
    {
      title: "Best Catering Equipments & Tools",
      description: "From elegant serving sets to essential kitchen gear, we provide premium catering tools to elevate every event.",
      image: cateringImg,
    },
    {
      title: "Event Essentials & Furniture Rentals",
      description: "Create the perfect setting with our curated collection of event furniture and essentials, designed for comfort and style.",
      image: planningImg,
    },
    {
      title: "Stylish Event Decor Rentals",
      description: "Add charm and character to your celebration with our thoughtfully selected decor pieces from lanterns to luxe carpets.",
      image: venueImg,
    },
    {
      title: "Premium Audio & Visual Equipment",
      description: "Ensure crystal-clear sound and stunning visuals with our high-quality microphones, speakers, projectors, and screens for any event size.",
      image: audiovisual, 
    },
    {
      title: "Professional Lighting Solutions",
      description: "Set the perfect mood with our versatile lighting options, including uplighting, stage lighting, and ambient decorative lights.",
      image: lightning, 
    },
    {
      title: "Tent & Canopy Rentals",
      description: "Protect your guests from the elements with our durable and stylish tents and canopies, perfect for outdoor occasions.",
      image: tentcanopy, 
    },
    {
      title: "Tableware & Glassware Collections",
      description: "Serve with elegance using our range of plates, cutlery, glassware, and table accessories for any event theme or size.",
      image: tableglassware,
    },
    {
      title: "Dance Floors & Staging Rentals",
      description: "Make your event unforgettable with customizable dance floors and sturdy stage setups for performances, speeches, or ceremonies.",
      image: floorstaging,
    },
    {
      title: "Heating & Cooling Equipment",
      description: "Keep guests comfortable year-round with our portable heaters, fans, and air coolers tailored to your venue needs.",
      image: heatingcooling, 
    },
    {
      title: "Photo Booths & Backdrops",
      description: "Add fun and capture memories with our interactive photo booths and stylish backdrops, ideal for weddings and parties.",
      image: photobooth, 
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; // Number of items to show at once

  // Calculate the current items to display
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
        <h2 className="text-3xl font-bold">Welcome To <span className="text-red-500">Glimmer Events!</span></h2>
      </div>
      
      <div className="relative flex items-center justify-center">
        {/* Left arrow */}
        <button 
          onClick={prevSlide}
          className="absolute left-0 z-10 p-2 text-red-700 hover:text-red-500 focus:outline-none"
          aria-label="Previous items"
        >
          <FaChevronLeft size={24} />
        </button>
        
        {/* Items container */}
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
        
        {/* Right arrow */}
        <button 
          onClick={nextSlide}
          className="absolute right-0 z-10 p-2 text-red-700 hover:text-red-500 focus:outline-none"
          aria-label="Next items"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default Features;