import React from 'react';
import HeroSection from '../component/HomePage/HeroSection';
import Features from '../component/HomePage/Features';
import PopularEvents from '../component/HomePage/PopularEvents';
//import Testimonials from '../component/HomePage/Testimonials';
import FAQ from '../component/HomePage/FAQ';
import Footer from '../component/Footer';
import Header from '../component/Header';

const Home = () => {
  return (
    <div className="font-sans text-gray-800">
      
      <HeroSection />
      <Features />
      <PopularEvents />
      <FAQ />
      
    </div>
  );
};

export default Home;
