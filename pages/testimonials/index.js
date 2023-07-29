import TestimonialSlider from "../../components/TestimonialSlider";

import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

const Testimonials = () => {
  return (
    <div className="h-full py-32 text-center bg-primary/30">
      <div className="container flex flex-col justify-center h-full mx-auto">
        {/* title */}
        <motion.h2
          variants={fadeIn("right", 0.1)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="mb-8 h2 xl:mb-0"
        >
          What Clients <span className="text-accent">Say.</span>
        </motion.h2>
        {/* slider */}
        <motion.div
          variants={fadeIn("left", 0.1)}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <TestimonialSlider />
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
