import React from "react";
import HistoryImage from "../../assets/our-history.jpeg"; // Main background image
import HistorySmallImage from "../../assets/our-journey.jpeg"; // Small overlapping image

const OurHistory = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="relative w-full md:w-1/2 flex justify-center">
          <img
            src={HistoryImage}
            alt="Our History"
            className="w-80 h-96 object-cover rounded-lg"
          />

          <img
            src={HistorySmallImage}
            alt="Our Milestones"
            className="w-60 h-80 object-cover rounded-lg border-4 border-white shadow-xl absolute top-10 left-10"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">Our Journey</h2>
          <p className="text-gray-600 leading-relaxed">
            Since our founding, Glimmer has been dedicated to delivering
            unforgettable moments. Our journey reflects growth, innovation, and
            a commitment to excellence across every event and project we
            undertake. Over the years, we have expanded our capabilities, grown our talented team, and embraced cutting-edge trends and technologies, all while staying true to the values that define us: creativity, collaboration, and excellence. Our journey is far from over, and as we continue to evolve, we remain focused on delivering experiences that captivate, inspire, and leave a lasting impact.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurHistory;
