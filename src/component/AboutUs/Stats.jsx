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
    { number: 150, suffix: '+', label: 'Smart IoT Sensors Installed' },
    { number: 85, suffix: ' Acres', label: 'Virtual Tree Mapping Coverage' },
    { number: 95, suffix: '%', label: 'Accuracy in Resin-Rich Zone Detection' },
    { number: 100, suffix: '%', label: 'Blockchain Traceability Secured' },
  ];

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="w-44">
            <h3 className="text-4xl font-bold text-green-600">
              <CountUp to={stat.number} shouldAnimate={isInView} />
              {stat.suffix}
            </h3>
            <p className="text-gray-700 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
