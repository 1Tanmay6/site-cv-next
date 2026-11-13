import RecentWork from "../../components/RecentWork";
import Bulb from "../../components/Bulb";
import Circles from "../../components/Circles";
import PageTitle from "../../components/PageTitle";

import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
const Work = () => {
  return (
    <div className="h-full overflow-y-auto bg-primary/30 pt-44 pb-32 xl:py-36">
      <PageTitle
        title="Work | Tanmay Patil"
        description="Selected agentic AI and data science work for finance and supply chain."
      />
      <Circles />
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-x-8 gap-y-12">
          {/* text */}
          <div className="text-center flex xl:w-[30vw] flex-col lg:text-left mb-4 xl:mb-0 xl:sticky xl:top-24 h-max">
            <motion.h2
              variants={fadeIn("up", 0.1)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="h2 xl:mt-8"
            >
              My Work<span className="text-accent">.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn("up", 0.25)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="mb-4 max-w-[400px] mx-auto lg:mx-0"
            >
              Selected production AI work across finance, supply chain, and
              research. Expand a chapter for the projects and outcomes.
            </motion.p>

            <motion.div
              variants={fadeIn("up", 0.35)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="w-full max-w-[400px] mx-auto lg:mx-0 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Career snapshot
              </p>
              <ol className="mt-4 space-y-3">
                {[
                  { year: "2025 — Present", role: "Genpact · Data Scientist" },
                  { year: "2025", role: "Genpact · Data Science Intern" },
                  { year: "2024", role: "Vanquisher · Data Science Intern" },
                  { year: "2021 — 2025", role: "NIIT University · B.Tech CSE" },
                ].map((item) => (
                  <li key={item.role} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="text-sm text-white">{item.role}</p>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">
                        {item.year}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2 mt-5">
                {["ICLR 2026", "Agentic AI", "RAG", "HITL"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center mt-5 text-sm transition-all duration-300 gap-x-2 text-accent hover:gap-x-3"
              >
                Let&apos;s talk
                <BsArrowRight aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
          {/* Recent work */}
          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="w-full xl:max-w-[65%]"
          >
            <RecentWork />
          </motion.div>
        </div>
      </div>
      <Bulb />
    </div>
  );
};

export default Work;
