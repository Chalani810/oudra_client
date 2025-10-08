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
            Advancing <span className="text-green-600">Innovation</span> Together
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our research team is dedicated to transforming traditional agarwood
            cultivation through technology and collaboration. By integrating IoT,
            AI, and blockchain, we craft a smarter, data-driven ecosystem that
            empowers planters and promotes transparency across the supply chain.
            <br /><br />
            At the heart of our project lies a shared commitment to sustainability
            and precision. Every step—from sensor deployment to data analytics—is
            a product of teamwork, curiosity, and scientific excellence.
            Together, we’re not just improving agriculture—we’re shaping the
            future of smart cultivation.
          </p>
        </div>

        {/* Images Container */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          {/* Back Image */}
          <img
            src={ExcellenceImage}
            alt="Research Collaboration"
            className="w-80 h-96 object-cover rounded-lg"
          />

          {/* Front Image */}
          <img
            src={ExcellenceSmallImage}
            alt="Smart Farming Innovation"
            className="w-60 h-80 object-cover rounded-lg border-4 border-white shadow-xl absolute top-10 left-10"
          />
        </div>
      </div>
    </section>
  );
};

export default CraftingExcellence;
