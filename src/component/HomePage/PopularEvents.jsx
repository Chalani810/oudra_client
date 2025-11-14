import React from 'react';
import image5 from '../../component/HomePage/image46.jpg';
import image32 from '../../component/HomePage/image30.png';
import image31 from '../../component/HomePage/image31.jpg';
import image35 from '../../component/HomePage/image10.webp';
import { Link } from 'react-router-dom';

const events = [
  {
    title: "IoT-Based Smart Monitoring",
    image: image5,
  },
  {
    title: "AI Image Analysis",
    image: image32,
  },
  {
    title: "Virtual Tree Mapping",
    image: image31,
  },
  {
    title: "Blockchain Traceability",
    image: image35,
  },
];

const PopularEvents = () => {
  return (
    <section className="px-8 py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          Core Features of <span className="text-green-600">Oudra</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Discover how IoT, AI, and blockchain technologies come together to map, monitor, and manage agarwood cultivation efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {events.map((event, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300">
            <img src={event.image} alt={event.title} className="h-48 w-full object-cover rounded-t-lg" />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold">{event.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right mt-6">
        <Link 
          to="/customerviewevent" 
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Learn more...
        </Link>
      </div>
    </section>
  );
};

export default PopularEvents;
