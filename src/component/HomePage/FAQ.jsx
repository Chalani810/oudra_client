import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Optional: lucide-react icons

const faqs = [
  {
    question: "What types of items do you rent out",
    answer: "We offer a wide range of event essentials, including chairs, tables, catering equipment, decor items like lanterns and flower vases, curtains, carpets, and more, everything you need to set the stage for a memorable event."
  },
  {
    question: "Can I rent items individually or do I need a full package?",
    answer: "You can do both! Rent individual items based on your specific needs or choose from our curated packages designed for weddings, parties, corporate events more."
  },
  {
    question: "How long can I keep the rented items?",
    answer: "Our standard rental period is 24 to 48 hours, but we’re flexible! If you need items for a longer duration, just let us know during booking."
  },
  {
    question: "What happens if an item gets damaged?",
    answer: "Accidents happen,we get it. Minor wear and tear is covered, but significant damage or loss may incur additional charges. We’ll walk you through the details when you book."
  },
  {
    question: "How far in advance should I reserve rental items?",
    answer: "We recommend booking at least 2–4 weeks in advance, especially during busy seasons, to ensure availability of your preferred items."
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-8 py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          Frequently Asked <span className="text-red-500">Questions</span>
        </h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg shadow">
            <button
              className="flex justify-between items-center w-full px-6 py-4 text-left"
              onClick={() => toggleAnswer(idx)}
            >
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              {openIndex === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  );
};

export default FAQ;
