import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = 'http://localhost:5000'; // Set your backend API base URL

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/event/`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  const handleReadMore = (eventId,eventName) => {
    navigate(`/customerproduct/${eventId}/${eventName}`);
  };

  return (
    <div className="bg-white">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">Plan Your Special Event</h1>
        <p className="mt-4 text-red-400">Choose from our beautifully curated event plans!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-10 p-10">
        {events.map((event) => {
          const imageSrc = event.photoUrl || event.image || 'https://via.placeholder.com/400x300?text=Wedding+Event';
          const title = event.title || 'Wedding Ceremony';
          const description =
            event.description ||
            'Celebrate your dream wedding with elegance and charm. From beautiful decor to seamless arrangements, we handle everything for your big day.';

          return (
            <div
              key={event._id}
              className="flex flex-col md:flex-row bg-gray-100 rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={imageSrc}
                alt={title}
                className="w-full md:w-1/2 h-80 object-cover"
              />
              <div className="p-6 flex flex-col justify-between w-full md:w-3/4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{title}</h2>
                  <p className="text-gray-700 mb-4">{description}</p>
                </div>
                <button
                  onClick={() => handleReadMore(event._id,event.title)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-fit"
                >
                  View Products
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default EventsPage;
