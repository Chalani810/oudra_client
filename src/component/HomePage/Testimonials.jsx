import React from 'react';
import image12 from '../../component/HomePage/image12.jpg';
import image36 from '../../component/HomePage/image36.jpg';
import image14 from '../../component/HomePage/image14.jpg';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    name: "Dr. Nimal Perera",
    feedback:
      "The system’s IoT integration provides precise and reliable monitoring of agarwood trees. It’s a major step forward for data-driven plantation management in Sri Lanka.",
    image: image12,
  },
  {
    name: "Pintanna Plantation Team",
    feedback:
      "The pilot deployment at our Ayagama Estate has significantly improved our ability to detect issues early and optimize resin yield. A truly practical innovation.",
    image: image36,
  },
  {
    name: "Prof. Malathi Fernando",
    feedback:
      "Combining AI image analysis and blockchain traceability is an impressive approach. It strengthens sustainability, transparency, and global competitiveness for agarwood producers.",
    image: image14,
  },
];

const Testimonials = () => {
  return (
    <section className="px-8 py-10 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          What Experts <span className="text-green-600">Say About Us</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testi, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            <img
              src={testi.image}
              alt={testi.name}
              className="w-20 h-20 rounded-full mb-4 object-cover"
            />
            <p className="text-gray-600 mb-4">{testi.feedback}</p>
            <h4 className="font-semibold">{testi.name}</h4>
          </div>
        ))}
      </div>

      <div className="text-right mt-6">
        <Link
          to="/AboutUs#testimonials"
          className="text-green-600 hover:text-green-800 font-medium"
        >
          See more...
        </Link>
      </div>
    </section>
  );
};

export default Testimonials;
