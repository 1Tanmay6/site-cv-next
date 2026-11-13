//framer motion

import { motion } from "framer-motion";

// variants
const transitionVariants = {
  initial: {
    scaleX: 1,
    originX: 0,
  },
  animate: {
    scaleX: 0,
    originX: 0,
  },
  exit: {
    scaleX: 1,
    originX: 0,
  },
};

const panels = [
  { className: "bg-[#1b3634] z-[100]", delay: 0 },
  { className: "bg-[#224442] z-[99]", delay: 0.05 },
  { className: "bg-[#284e4c] z-[98]", delay: 0.1 },
];

const Transition = () => {
  return (
    <>
      {panels.map((panel) => (
        <motion.div
          key={panel.className}
          className={`fixed inset-0 w-screen h-screen origin-left will-change-transform pointer-events-none ${panel.className}`}
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            delay: panel.delay,
            duration: 0.45,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      ))}
    </>
  );
};

export default Transition;
