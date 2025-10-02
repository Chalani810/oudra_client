// components/AboutUs/Stats.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

const CountUp = ({ to, shouldAnimate }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.floor(latest));

  useEffect(() => {
    if (shouldAnimate) {
      const controls = animate(count, to, {
        duration: 2,
        ease: 'easeOut',
      });
      return controls.stop;
    }
  }, [shouldAnimate, count, to]);

  return <motion.span>{rounded}</motion.span>;
};

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { number: 150, suffix: '+', label: 'Complete Projects' },
    { number: 25, suffix: '+', label: 'Team Members' },
    { number: 200, suffix: '+', label: 'Client Reviews' },
    { number: 12, suffix: '', label: 'Winning Awards' },
  ];

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="w-40">
            <h3 className="text-4xl font-bold text-red-500">
              <CountUp to={stat.number} shouldAnimate={isInView} />
              {stat.suffix}
            </h3>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
