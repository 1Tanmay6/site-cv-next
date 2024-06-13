import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaWordpress,
  FaFigma,
  FaBootstrap,
  FaJava,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiFramer,
  SiTailwindcss,
  SiCanva,
  SiFlutter,
  SiDart,
  SiPython,
  SiMongodb,
  SiFirebase,
  SiMysql,
  SiSqlite,
  SiPostgresql,
  SiRazorpay,
  SiStripe,
  SiMicrosoftazure,
  SiPandas,
  SiOpenai,
  SiDocker,
  SiApachehadoop,
  SiApachespark,
  SiApachehive,
} from "react-icons/si";
//  data
const aboutData = [
  {
    title: "Technologies",
    info: [
      {
        title: "Data Science",
        icons: [
          <SiMicrosoftazure key="SiMicrosoftazure " />,
          <SiPandas key="SiPandas " />,
          <SiOpenai key="SiOpenai " />,
          <SiDocker key="SiDocker " />,
        ],
      },
      {
        title: "Big Data",
        icons: [
          <SiApachehadoop key="SiApachehadoop " />,
          <SiApachespark key="SiApachespark " />,
          <SiApachehive key="SiApachehive " />,
        ],
      },
      {
        title: "Web Development",
        icons: [
          <FaHtml5 key="html5" />,
          <FaCss3 key="css3" />,
          <SiTailwindcss key="tailwind" />,
          <FaJs key="js" />,
          <FaReact key="react" />,
          <SiNextdotjs key="nextjs" />,
          <SiFramer key="framer" />,
          <FaBootstrap key="bootstrap" />,
          <FaWordpress key="wordpress" />,
        ],
      },
      {
        title: "Application Development",
        icons: [<SiFlutter key="flutter" />, <SiDart key="dart" />],
      },
      {
        title: "Programming Languages",
        icons: [<SiPython key="python" />, <FaJava key="java" />],
      },
      {
        title: "Databases",
        icons: [
          <SiMongodb key="mongodb" />,
          <SiFirebase key="firebase" />,
          <SiMysql key="mysql" />,
          <SiSqlite key="sqlite" />,
          <SiPostgresql key="postgresql" />,
        ],
      },
      {
        title: "Payment Gateways",
        icons: [<SiRazorpay key="razorpay" />, <SiStripe key="stripe" />],
      },
      {
        title: "UI/UX Design",
        icons: [<FaFigma key="figma" />, <SiCanva key="canva" />],
      },
    ],
  },

  {
    title: "Education",
    info: [
      {
        title: "Tapti Public School - Bhusawal, Maharastra",
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
        marks: "CGPA - 9.41",
      },
    ],
  },

  {
    title: "Experience",
    info: [
      {
        title: "Web Developer Intern - Oasis Infobyte",
        stage: "Jun 2023 - Jul 2023",
      },
      {
        title: "Lead Web Developer - GDSC NIIT",
        stage: "Oct 2022 - Sep 2023",
      },
      {
        title: "Technical Core - GDSC NIIT",
        stage: "Oct 2023 - Jun 2024",
      },
      {
        title: "Data Scientist - Vanqiusher Software Services",
        stage: "Jun 2024 - Present",
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
import { fadeIn } from "../../variants";

import CountUp from "react-countup";

const About = () => {
  const [index, setIndex] = useState(0);
  console.log(index);
  return (
    <div className="h-[90%] xl:h-full overflow-auto text-center py-44 bg-primary/30 xl:text-left">
      <Circles />
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="hidden xl:flex absolute bottom-[-450px] -left-[500px] xl:h-[1500px] xl:w-[1000px]"
      >
        <Avatar />
      </motion.div>
      <div className="container flex flex-col items-center h-full mx-auto xl:flex-row gap-x-6">
        {/*Text */}
        <div className="flex flex-col justify-center flex-1">
          <motion.h2
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="h2"
          >
            Insightful Analysis and
            <span className="text-accent"> Innovative</span> Solutions
          </motion.h2>
          <motion.p
            variants={fadeIn("right", 0.35)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0"
          >
            As a versatile programmer with over 5 years of experience in
            programming, I have a strong foundation in Python and Java. My
            passion for web development has led me to create visually appealing
            and functional websites. I am also a data scientist skilled in
            leveraging generative AI to create innovative products.
            Additionally, I specialize in developing mobile applications using
            Flutter and Dart, delivering seamless user experiences across
            platforms
          </motion.p>
          {/* counters */}
          <motion.div
            variants={fadeIn("right", 0.5)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="hidden mx-auto mb-8 md:flex md:max-w-xl xl:max-w-none xl:mx-0"
          >
            <div className="flex flex-1 xl:x-gap-6">
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:top-0 after:right-0 ">
                <div className="mb-2 text-xl font-extrabold xl:text-3xl text-accent">
                  <CountUp start={0} end={1000} duration={5} /> +
                </div>
                <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
                  Hours of Coding
                </div>
              </div>
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:top-0 after:right-0 ">
                <div className="mb-2 text-xl font-extrabold xl:text-3xl text-accent">
                  <CountUp start={0} end={20} duration={5} /> +
                </div>
                <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
                  Finished Projects
                </div>
              </div>
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:top-0 after:right-0 ">
                <div className="mb-2 text-xl font-extrabold xl:text-3xl text-accent">
                  <CountUp start={0} end={7} duration={5} /> +
                </div>
                <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
                  Programming Languages
                </div>
              </div>
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:top-0 after:right-0 ">
                <div className="mb-2 text-xl font-extrabold xl:text-3xl text-accent">
                  <CountUp start={0} end={4} duration={5} /> +
                </div>
                <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
                  winning awards
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/*About */}
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="flex flex-col w-full xl:max-w-[48%] h-[350px] xl:h-[480px]"
        >
          <div className="flex mx-auto mb-4 gap-x-4 xl:gap-x-8 xl:mx-0">
            {aboutData.map((item, i) => {
              return (
                <div
                  key={i}
                  className={`${
                    index === i &&
                    "text-accent after:w-[100%] after:bg-accent after:transition-all after:duration-300"
                  } relative capitalize cursor-pointer xl:text-lg after:w-8
                  after:h-[2px] after:bg-white after:absolute after:-bottom-1 after:left-0`}
                  onClick={() => setIndex(i)}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-center py-2 overflow-auto xl:py-6 gap-y-1 xl:gap-y-4 xl:items-start scrollbar-thin ">
            {aboutData[index].info.map((item, i) => {
              return (
                <div
                  key={i}
                  className="flex flex-col flex-1 md:flex-row max-w-max gap-x-2 item-center text-white/60"
                >
                  <div className="mb-2 font-light md:mb-0 ">{item.title}</div>
                  <div className="hidden md:flex">-</div>
                  <div>{item.stage}</div>

                  {/*Icons */}
                  <div className="flex items-center justify-center gap-x-4">
                    {item.icons?.map((icon, i) => {
                      return (
                        <div
                          key={i}
                          className="text-2xl text-center text-white"
                        >
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
