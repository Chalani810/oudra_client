import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is the Decision Support System for Agarwood Cultivation?",
    answer:
      "It’s an integrated IoT, AI, and blockchain-based platform designed to support agarwood farmers in monitoring tree health, predicting resin yield, and ensuring transparent traceability from plantation to market.",
  },
  {
    question: "How does the system monitor agarwood trees?",
    answer:
      "Smart sensor nodes are attached to trees to measure parameters such as soil moisture, temperature, humidity, and pH. These readings are transmitted to a cloud-based dashboard for real-time monitoring and decision-making.",
  },
  {
    question: "What role does AI play in the system?",
    answer:
      "The AI model uses image processing to identify resin-rich zones in tree trunks without cutting into them. This non-invasive method helps protect trees and improves resin yield prediction accuracy.",
  },
  {
    question: "How does blockchain improve traceability?",
    answer:
      "Each tree’s lifecycle—from planting to harvest—is securely recorded on a blockchain-based digital certificate. This ensures data integrity, transparency, and authenticity for buyers and regulators.",
  },
  {
    question: "Where has the system been tested?",
    answer:
      "The prototype has been successfully tested at Pintanna Plantations’ Ayagama Estate in Sri Lanka. Pilot trials showed improvements in yield, disease detection, and data accuracy.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-8 py-10 bg-green-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-green-800">
          Frequently Asked <span className="text-green-500">Questions</span>
        </h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow">
            <button
              className="flex justify-between items-center w-full px-6 py-4 text-left"
              onClick={() => toggleAnswer(idx)}
            >
              <h3 className="text-lg font-semibold text-green-900">{faq.question}</h3>
              {openIndex === idx ? (
                <ChevronUp className="w-5 h-5 text-green-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-green-700" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-gray-700">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
