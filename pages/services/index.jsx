import ServiceSlider from "../../components/ServiceSlider";
import Bulb from "../../components/Bulb";
import Circles from "../../components/Circles";
import PageTitle from "../../components/PageTitle";

import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
const Services = () => {
  return (
    <div className="h-full overflow-y-auto bg-primary/30 pt-44 pb-36 xl:flex xl:items-center xl:py-36">
      <PageTitle
        title="Services | Tanmay Patil"
        description="GenAI, data science, and synthetic data services for finance and supply chain teams."
      />
      <Circles />
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-x-8">
          {/* text */}
          <div className="text-center flex xl:w-[30vw] flex-col lg:text-left mb-4 xl:mb-0">
            <motion.h2
              variants={fadeIn("up", 0.1)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="h2 xl:mt-8"
            >
              My Services<span className="text-accent">.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn("up", 0.25)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="mb-4 max-w-[400px] mx-auto lg:mx-0"
            >
              I build production GenAI and data science systems for finance and
              supply chain. Recent work includes ACE (ICLR 2026, ~80% lower
              adaptation cost), a 3-way reconciliation platform (~90%
              automated), and a demand forecasting agent (~40% lower planner
              workload).
            </motion.p>
          </div>
          {/* Slider */}
          <motion.div
            variants={fadeIn("down", 0.1)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="w-full xl:max-w-[65%]"
          >
            <ServiceSlider />
          </motion.div>
        </div>
      </div>
      <Bulb />
    </div>
  );
};

export default Services;
