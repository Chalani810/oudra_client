import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/feedback/`);
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setError("Failed to load testimonials");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= feedbacks.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? feedbacks.length - 3 : prevIndex - 1
    );
  };

  // Get currently visible testimonials (3 at a time)
  const visibleTestimonials = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % feedbacks.length;
    visibleTestimonials.push(feedbacks[index]);
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction === "right" ? 100 : -100,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction === "right" ? -100 : 100,
      transition: { duration: 0.2 },
    }),
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">
            What People Say About Glimmer
          </h2>
          <p>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">
            What People Say About Glimmer
          </h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">
            What People Say About Glimmer
          </h2>
          <p>No testimonials available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="py-16 px-6 bg-gray-100 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12"
        >
          What People Say About Glimmer
        </motion.h2>

        <div className="relative flex items-center justify-center">
          {/* Left arrow - positioned to the left of the cards */}
          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            className="absolute left-0 top-1/2 transform bg-white p-3 rounded-full shadow-md hover:bg-gray-200 z-10"
            aria-label="Previous testimonials"
          >
            <FiChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Testimonial cards container */}
          <div className="relative w-full max-w-4xl mx-12"> {/* Added mx-12 for side spacing */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={direction}
                className="grid md:grid-cols-3 gap-8"
              >
                {visibleTestimonials.map((feedback) => (
                  <motion.div
                    key={feedback._id}
                    variants={itemVariants}
                    custom={direction}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
                  >
                    <motion.img
                      src={
                        feedback.userId.profilePicture ||
                        "https://randomuser.me/api/portraits/lego/1.jpg"
                      }
                      alt={feedback.userId.firstName}
                      className="w-16 h-16 mx-auto rounded-full mb-4 object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://randomuser.me/api/portraits/lego/1.jpg";
                      }}
                    />
                    <motion.p
                      className="text-gray-600 mb-4 italic"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      "{feedback.message}"
                    </motion.p>
                    <motion.h3
                      className="font-bold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {feedback.userId.firstName} {feedback.userId.lastName}
                    </motion.h3>
                    <motion.div
                      className="flex justify-center mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < feedback.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right arrow - positioned to the right of the cards */}
          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            className="absolute right-0 top-1/2 transform bg-white p-3 rounded-full shadow-md hover:bg-gray-200 z-10"
            aria-label="Next testimonials"
          >
            <FiChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;