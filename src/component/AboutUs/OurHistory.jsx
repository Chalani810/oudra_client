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
            alt="Agarwood Research"
            className="w-80 h-96 object-cover rounded-lg"
          />

          <img
            src={HistorySmallImage}
            alt="Smart Cultivation"
            className="w-60 h-80 object-cover rounded-lg border-4 border-white shadow-xl absolute top-10 left-10"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">Our <span className="text-green-600">Research</span> Journey</h2>
          <p className="text-gray-600 leading-relaxed">
            Agarwood — often called “liquid gold” — is one of the world’s most valuable natural
            resources, used in perfumes, incense, and medicines. In Sri Lanka, Wallapatta
            (Agarwood) cultivation has great potential, but traditional manual monitoring
            methods cause data inaccuracy, disease risks, and yield loss.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Our research introduces an <strong>AI and IoT-based Decision Support System</strong> for
            Agarwood cultivation. Smart sensor nodes monitor soil moisture, temperature,
            humidity, and pH in real-time, while a backend analytics engine predicts growth
            patterns and detects stress or fungal threats. Computer vision techniques are used
            to identify resin-rich zones non-invasively, avoiding destructive testing.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            To ensure full transparency and trust, every tree’s lifecycle is recorded on a
            <strong> blockchain-backed digital certificate</strong>, providing traceability from seedling
            to oud oil. Our web dashboard (built using the MERN stack) and mobile app empower
            plantation managers and field workers with real-time insights, task alerts, and
            automated data-driven decisions.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Successfully piloted at Pintanna Plantations’ Ayagama Estate, this system has
            demonstrated higher yields, improved efficiency, and full supply chain visibility.
            Our vision is to make Sri Lanka a leader in sustainable, technology-driven
            Agarwood cultivation — setting a global model for smart agriculture.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurHistory;
