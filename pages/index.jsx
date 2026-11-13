import Head from "next/head";
import ParticlesContainer from "../components/ParticlesContainer";
import ProjectsBtn from "../components/ProjectsBtn";
import Avatar from "../components/Avatar";

// framer motion
import { motion } from "framer-motion";

//variants
import { fadeIn } from "../variants";

const Home = () => {
  const string = `I build production LLM and agentic systems at Genpact for finance and supply chain — including ACE (ICLR 2026), a 3-way reconciliation platform, and a demand forecasting agent.`;
  return (
    <div className="h-full bg-primary/60">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>Tanmay Patil — Agentic AI & Production LLM Systems</title>
      </Head>
      <div className="w-full h-full bg-linear-to-r from-primary/10 via-black-30 to-black/10">
        {/* Title */}
        <div className="container flex flex-col justify-start h-full pt-44 mx-auto text-center xl:justify-center xl:pt-40 xl:text-left">
          <motion.h1
            variants={fadeIn("down", 0.1)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="h1"
          >
            Agentic AI, <br />
            Built to <span className="text-accent">Ship</span>
          </motion.h1>
          {/* supporting description*/}
          <motion.p
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="max-w-sm mx-auto mb-10 xl:max-w-xl xl:mx-0 xl:mb-16"
          >
            {string}
          </motion.p>
          {/*btn */}
          <div className="relative flex justify-center xl:hidden">
            <ProjectsBtn />
          </div>
          <motion.div
            variants={fadeIn("down", 0.3)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="hidden xl:flex"
          >
            <ProjectsBtn />
          </motion.div>
        </div>
      </div>
      {/*bg img */}
      <div className="absolute bottom-0 right-[2%] xl:w-[70%] xl:h-full w-full h-[60%] top-0">
        <div className="absolute w-full right-[2%] h-full bg-none xl:bg-explosion xl:bg-contain xl:bg-right xl:bg-no-repeat mix-blend-color-dodge traslate-z-0"></div>
        {/* particles */}
        <ParticlesContainer />
        {/* avatar */}
        <motion.div
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="w-full h-full max-w-[800px] max-h-[700px] absolute -bottom-[-2px] lg:right-[3%]"
        >
          <Avatar />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
