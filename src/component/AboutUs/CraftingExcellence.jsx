import React from "react";
import ExcellenceImage from "../../assets/au1.jpeg"; // BACK image
import ExcellenceSmallImage from "../../assets/au2.jpeg"; // FRONT image

const CraftingExcellence = () => {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-4">
            Crafting <span className="text-red-500">Excellence</span> Together
          </h2>
          <p className="text-gray-600 leading-relaxed">
            At Glimmer, we believe in pushing the boundaries of excellence. Our
            team collaborates to craft memorable experiences and leave lasting
            impressions. Every project is a blend of passion, creativity, and
            precision. At the heart of Glimmer is a dedication to leaving a lasting impression—one that reflects not just the quality of our work, but also the integrity and enthusiasm of the people behind it. Together, we create more than results; we create impact.
          </p>
        </div>

        {/* Images Container */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          {/* Back Image */}
          <img
            src={ExcellenceImage}
            alt="Background"
            className="w-80 h-96 object-cover rounded-lg"
          />

          {/* Front Image */}
          <img
            src={ExcellenceSmallImage}
            alt="Foreground"
            className="w-60 h-80 object-cover rounded-lg border-4 border-white shadow-xl absolute top-10 left-10"
          />
        </div>
      </div>
    </section>
  );
};

export default CraftingExcellence;
