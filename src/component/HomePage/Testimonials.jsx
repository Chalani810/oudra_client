import React from 'react';
import image12 from '../../component/HomePage/image12.jpg';
import image36 from '../../component/HomePage/image36.jpg';
import image14 from '../../component/HomePage/image14.jpg';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    name: "Sarah Johnson",
    feedback: "Glimmer turned our proposal into a magical moment we’ll never forget, every detail was perfect.",
    image: image12,
  },
  {
    name: "David Smith",
    feedback: "Our gender reveal was a dream come true! The Glimmer team handled everything with care and creativity.",
    image: image36,
  },
  {
    name: "Emily Davis",
    feedback: "Impeccable service and breathtaking decor,our corporate event was a total success, thanks to Glimmer.",
    image: image14,
  },
];

const Testimonials = () => {
  return (
    <section className="px-8 py-10 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">What Our <span className="text-red-500">Clients Say</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <img src={testi.image} alt={testi.name} className="w-20 h-20 rounded-full mb-4 object-cover" />
            <p className="text-gray-600 mb-4">{testi.feedback}</p>
            <h4 className="font-semibold">{testi.name}</h4>
            </div>
        ))}
      </div>

      <div className="text-right mt-6">
        <Link 
          to="/AboutUs#testimonials" 
          className="text-red-500 hover:text-red-700 font-medium"
        >
          See more....
        </Link>
      </div>
    </section>
  );
};

export default Testimonials;
