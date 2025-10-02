import React from 'react';
import image5 from '../../component/HomePage/image5.jpg';
import image32 from '../../component/HomePage/image32.jpg';
import image31 from '../../component/HomePage/image31.jpg';
import image35 from '../../component/HomePage/image35.jpg';
import { Link } from 'react-router-dom';

const events = [
  {
    title: "Wedding",
    image: image5,
  },
  {
    title: "Birthday Party",
    image: image32,
  },
  {
    title: "Anniversary",
    image: image31,
  },
  {
    title: "Corporate Event",
    image: image35,
  },
];

const PopularEvents = () => {
  return (
    <section className="px-8 py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Celebrated Moments... <span className="text-red-500">Trusted Rentals...</span></h2>
        <p className="text-gray-600 mt-2">From Dreamy Weddings to Corporate Galas,We've Got You Covered!</p>
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
          className="text-red-500 hover:text-red-700 font-medium"
        >
          See more....
        </Link>
      </div>
    </section>
  );
};

export default PopularEvents;
