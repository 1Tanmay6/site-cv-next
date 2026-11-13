import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaFigma,
  FaJava,
  FaCloud,
  FaAws,
  FaChartBar,
  FaChartLine,
  FaDatabase,
  FaMagic,
  FaBrain,
  FaNetworkWired,
  FaProjectDiagram,
  FaRobot,
  FaServer,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiFramer,
  SiTailwindcss,
  SiFlutter,
  SiDart,
  SiPython,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiPandas,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiNumpy,
  SiHuggingface,
  SiLangchain,
  SiLanggraph,
  SiModelcontextprotocol,
  SiOllama,
  SiVllm,
  SiSnowflake,
  SiDocker,
  SiGithub,
} from "react-icons/si";

//  data
const aboutData = [
  {
    title: "Technologies",
    type: "tech",
    info: [
      {
        title: "GenAI & Agentic",
        items: [
          { name: "LangChain", icon: <SiLangchain /> },
          { name: "LangGraph", icon: <SiLanggraph /> },
          { name: "LlamaIndex", icon: <FaRobot /> },
          { name: "RAG", icon: <FaProjectDiagram /> },
          { name: "Prompt Engineering", icon: <FaMagic /> },
          { name: "LLM Fine-tuning", icon: <FaBrain /> },
          { name: "MCP & Tool Calling", icon: <SiModelcontextprotocol /> },
          { name: "Hugging Face", icon: <SiHuggingface /> },
          { name: "Ollama", icon: <SiOllama /> },
          { name: "vLLM", icon: <SiVllm /> },
        ],
      },
      {
        title: "Data Science & ML",
        items: [
          { name: "Python", icon: <SiPython /> },
          { name: "Pandas", icon: <SiPandas /> },
          { name: "NumPy", icon: <SiNumpy /> },
          { name: "scikit-learn", icon: <SiScikitlearn /> },
          { name: "PyTorch", icon: <SiPytorch /> },
          { name: "TensorFlow", icon: <SiTensorflow /> },
          { name: "Time-series Forecasting", icon: <FaChartLine /> },
          { name: "GANs / Synthetic Data", icon: <FaNetworkWired /> },
        ],
      },
      {
        title: "Cloud, MLOps & BI",
        items: [
          { name: "AWS", icon: <FaAws /> },
          { name: "SageMaker", icon: <FaServer /> },
          { name: "Azure ML", icon: <FaCloud /> },
          { name: "Snowflake", icon: <SiSnowflake /> },
          { name: "Docker", icon: <SiDocker /> },
          { name: "Tableau / Power BI", icon: <FaChartBar /> },
        ],
      },
      {
        title: "Databases",
        items: [
          { name: "SQL", icon: <FaDatabase /> },
          { name: "PostgreSQL", icon: <SiPostgresql /> },
          { name: "MySQL", icon: <SiMysql /> },
          { name: "MongoDB", icon: <SiMongodb /> },
        ],
      },
      {
        title: "Web & App Development",
        items: [
          { name: "JavaScript", icon: <FaJs /> },
          { name: "React", icon: <FaReact /> },
          { name: "Next.js", icon: <SiNextdotjs /> },
          { name: "Tailwind CSS", icon: <SiTailwindcss /> },
          { name: "Framer Motion", icon: <SiFramer /> },
          { name: "HTML5", icon: <FaHtml5 /> },
          { name: "CSS3", icon: <FaCss3 /> },
          { name: "Java", icon: <FaJava /> },
          { name: "Flutter", icon: <SiFlutter /> },
          { name: "Dart", icon: <SiDart /> },
        ],
      },
      {
        title: "Design & Tooling",
        items: [
          { name: "Figma", icon: <FaFigma /> },
          { name: "Git & GitHub", icon: <SiGithub /> },
        ],
      },
    ],
  },

  {
    title: "Education",
    info: [
      {
        title: "Tapti Public School - Bhusawal, Maharashtra",
        stage: "2006 - 2019",
        marks: "10th Percentage - 89.2%",
      },
      {
        title: "Anglo Urdu Boys High School & Junior college - Pune",
        stage: "2019 - 2021",
        marks: "12th Percentage - 93.2%",
      },
      {
        title: "NIIT University - Neemrana, Rajasthan",
        stage: "2021 - 2025",
        marks: "B.Tech CSE (Data Science) · CGPA - 9.56/10.0",
      },
    ],
  },

  {
    title: "Experience",
    info: [
      {
        title: "Data Scientist - Genpact",
        stage: "Jun 2025 - Present · Bangalore, KA",
        marks: "~80% lower adaptation cost · ~90% reconciliation automated",
      },
      {
        title: "Data Science Intern - Genpact",
        stage: "Jan 2025 - Jun 2025 · Bangalore, KA",
        marks: "~40% faster client POCs · ~30% higher extraction accuracy",
      },
      {
        title: "Data Scientist (Intern) - Vanquisher Software Services",
        stage: "Jun 2024 - Nov 2024 · Remote",
        marks: "~30% higher extraction accuracy · ~80% less prep time",
      },
      {
        title: "Technical Core - GDSC NIIT",
        stage: "Oct 2023 - Jun 2024",
      },
      {
        title: "Lead Web Developer - GDSC NIIT",
        stage: "Oct 2022 - Sep 2023",
      },
      {
        title: "Web Developer Intern - Oasis Infobyte",
        stage: "Jun 2023 - Jul 2023",
      },
    ],
  },
  {
    title: "Highlights",
    info: [
      {
        title: "Agentic Context Engineering (ACE, ICLR 2026)",
        stage: "~80% lower adaptation cost · live in 2 production environments",
      },
      {
        title: "LLM fine-tuning for invoice–PO matching",
        stage: "~40% accuracy lift on noisy vendor data · Azure ML",
      },
      {
        title: "RAG + multi-agent demand forecasting",
        stage: "~40% lower planner workload · global CPG client",
      },
      {
        title: "Data Marketplace synthetic data platform",
        stage: "~40% faster POC/onboarding · still in production",
      },
      {
        title: "3-way invoice, PO & ledger reconciliation",
        stage: "~90% automated · ~90% lower manual review load",
      },
      {
        title: "Real-time logistics disruption model",
        stage: "~85% domain accuracy · ~12s decision latency",
      },
    ],
  },
  {
    title: "Certifications",
    info: [
      {
        title: " NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)",
        stage: "Jul 2023",
      },
      {
        title: "React - The Complete Guide 2023 (incl. React Router & Redux) ",
        stage: "Jun 2023",
      },
      {
        title: "The Complete 2023 Web Development Bootcamp",
        stage: "Jun 2023",
      },
      {
        title: "Ultimate Web Designer & Web Developer Course",
        stage: "Sept 2022",
      },
      {
        title: "Flutter & Dart - The Complete Guide 2023 Edition",
        stage: "Mar 2022",
      },
      {
        title: "Learn Python Programming Masterclass",
        stage: "Feb 2022",
      },
      {
        title: "PCAP: Programming Essentials in Python",
        stage: "Mar 2022",
      },
      {
        title: "Python for Data Science and Machine Learning Bootcamp",
        stage: "Jul 2023",
      },
      {
        title: "Java Programming Masterclass Covering Java 11 & Java 17",
        stage: "Sept 2022",
      },
    ],
  },
  // {
  //   title: "Experience",
  //   info: [
  //     {
  //       title: "Web Developer Intern - Oasis Infobyte",
  //       stage: "Jun 2023 - Jul 2023",
  //     },
  //     {
  //       title: "Lead Web Developer - GDSC NIIT",
  //       stage: "Oct 2022 - Present",
  //     },
  //   ],
  // },
];

//components

import Avatar from "../../components/Avatar";
import Circles from "../../components/Circles";
import PageTitle from "../../components/PageTitle";
import { fadeIn } from "../../variants";

const About = () => {
  const [index, setIndex] = useState(0);
  return (
    <div className="h-[90%] xl:h-full overflow-auto text-center py-44 bg-primary/30 xl:text-left">
      <PageTitle
        title="About | Tanmay Patil"
        description="Data scientist at Genpact building production LLM and agentic systems for finance and supply chain."
      />
      <Circles />
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="hidden xl:flex absolute bottom-[-450px] -left-[750px] xl:h-[1500px] xl:w-[1500px]"
      >
        <Avatar />
      </motion.div>
      <div className="container flex flex-col items-center mx-auto xl:flex-row xl:items-start gap-x-6">
        {/*Text */}
        <div className="relative z-10 flex flex-col justify-start flex-1 xl:bg-linear-to-r xl:from-primary xl:via-primary/85 xl:to-transparent xl:pr-8 xl:rounded-2xl">
          <motion.h2
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="h2"
          >
            From Research <br />
            to <span className="text-accent">Production</span>
          </motion.h2>
          <motion.p
            variants={fadeIn("right", 0.35)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-8 px-2 xl:px-0"
          >
            I build production LLM and agentic systems at Genpact for finance
            and supply chain — from ACE (ICLR 2026) to reconciliation and demand
            forecasting platforms. I focus on measurable, auditable systems.
          </motion.p>
          {/* resume links */}
          <motion.div
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex flex-wrap justify-center xl:justify-start gap-x-6 gap-y-2 mb-6 xl:mb-8"
          >
            <a
              href="/Tanmay_Patil_Resume_GenAI.pdf"
              download
              className="text-sm text-accent underline decoration-accent/40 hover:decoration-accent transition-all duration-300"
            >
              Download GenAI / Agentic Resume
            </a>
            <a
              href="/Tanmay_Patil_Resume_Data_Science.pdf"
              download
              className="text-sm text-accent underline decoration-accent/40 hover:decoration-accent transition-all duration-300"
            >
              Download Data Science / ML Resume
            </a>
          </motion.div>

          <motion.div
            variants={fadeIn("right", 0.45)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex flex-wrap justify-center xl:justify-start gap-3 mb-6"
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent transition-all duration-300 hover:border-accent/60 hover:bg-accent/15"
            >
              See my work
              <BsArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition-all duration-300 hover:border-accent/40 hover:text-accent"
            >
              Get in touch
              <BsArrowRight aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeIn("right", 0.55)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="w-full max-w-[420px] mx-auto xl:mx-0 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left"
          >
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-pulse bg-accent/60" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-accent" />
              </span>
              Currently
            </div>
            <p className="mt-3 text-sm text-white">Data Scientist @ Genpact</p>
            <p className="mt-1 text-sm text-white/60">
              Building production agentic systems and evaluation loops.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Agentic AI", "RAG", "LLM Fine-tuning", "HITL"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
        {/*About */}
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="flex flex-col w-full xl:max-w-[48%] h-auto xl:h-[520px]"
        >
          <div
            role="tablist"
            aria-label="About sections"
            className="flex flex-wrap justify-center xl:justify-start mx-auto mb-4 gap-x-4 gap-y-3 xl:mx-0"
          >
            {aboutData.map((item, i) => {
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  id={`about-tab-${i}`}
                  aria-selected={index === i}
                  aria-controls={`about-panel-${i}`}
                  onClick={() => setIndex(i)}
                  className={`${
                    index === i &&
                    "text-accent after:w-[100%] after:bg-accent after:transition-all after:duration-300"
                  } relative capitalize cursor-pointer bg-transparent border-0 p-0 xl:text-base after:w-8
                  after:h-[2px] after:bg-white after:absolute after:-bottom-1 after:left-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 rounded-sm`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
          <div
            role="tabpanel"
            id={`about-panel-${index}`}
            aria-labelledby={`about-tab-${index}`}
            tabIndex={0}
            className="flex flex-col items-center w-full px-1 py-2 overflow-visible xl:overflow-auto xl:py-6 gap-y-4 scrollbar-thin rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
          >
            {aboutData[index].type === "tech" ? (
              <div className="flex flex-col w-full gap-y-5">
                {aboutData[index].info.map((group) => (
                  <div key={group.title} className="w-full">
                    <div className="flex items-center mb-2 gap-x-2">
                      <span
                        aria-hidden="true"
                        className="w-4 h-px bg-accent/60"
                      />
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent/90">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((tech) => (
                        <li
                          key={tech.name}
                          className="inline-flex items-center gap-x-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-light text-white/80 transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-white"
                        >
                          <span
                            aria-hidden="true"
                            className="text-sm text-accent"
                          >
                            {tech.icon}
                          </span>
                          {tech.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              aboutData[index].info.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col flex-wrap md:flex-row max-w-full gap-x-2 item-center text-white/60"
                  >
                    <div className="mb-2 font-light md:mb-0 ">{item.title}</div>
                    <div className="hidden md:flex">-</div>
                    <div>{item.stage}</div>
                    {item.marks ? (
                      <div className="text-accent/80">{item.marks}</div>
                    ) : null}

                    {/*Icons */}
                    <div className="flex flex-wrap items-center justify-center gap-x-4">
                      {item.icons?.map((icon, i) => {
                        return (
                          <div
                            key={i}
                            aria-hidden="true"
                            className="text-2xl text-center text-white"
                          >
                            {icon}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
