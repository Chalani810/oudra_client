// pages/AboutUs.jsx
import React from 'react';
import { Link } from "react-router-dom";

// Importing sections from AboutUs components
import { CraftingExcellence, OurHistory, Testimonials, Stats } from '../component/AboutUs';

const AboutUs = () => {
  return (
    <div className="pt-20"> {/* Add top padding if you have a fixed Header */}
      
      {/* Section: Crafting Excellence */}
      <CraftingExcellence />
      
      {/* Section: Our History */}
      <OurHistory />
      
      {/* Section: Stats */}
      <Stats />
      
      {/* Section: Testimonials */}
      <Testimonials />

    </div>
  );
};

export default AboutUs;
