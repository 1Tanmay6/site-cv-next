import {
  RxPencil2,
  RxDesktop,
  RxReader,
  RxRocket,
  RxArrowTopRight,
} from "react-icons/rx";

import { FaRobot, FaDatabase, FaShieldAlt } from "react-icons/fa";

import { SiWebpack } from "react-icons/si";

import { Swiper, SwiperSlide } from "swiper/react";

import Link from "next/link";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { FreeMode, Pagination } from "swiper/modules";
// data
const serviceData = [
  {
    icon: <FaRobot />,
    title: "GenAI & Agentic Systems",
    description:
      "I ship production LLM systems like ACE — RAG, multi-agent orchestration, tool calling, MCP, and evaluation loops that reduce manual effort.",
    link: "/contact?id=genai",
  },
  {
    icon: <RxRocket />,
    title: "Data Driven Solutions",
    description:
      "I turn messy finance and supply-chain data into decision-ready insight, using Generative AI only where it produces a measurable outcome.",
    link: "/contact?id=branding",
  },
  {
    icon: <FaDatabase />,
    title: "Data Science & Forecasting",
    description:
      "I build forecasting and KPI systems like the demand forecasting agent, which cut planner workload ~40% through per-SKU model selection.",
    link: "/contact?id=datascience",
  },
  {
    icon: <FaShieldAlt />,
    title: "Synthetic Data & Privacy",
    description:
      "I build synthetic data platforms like Data Marketplace, which cut client POC timelines ~40% while preserving privacy and compliance.",
    link: "/contact?id=synthetic-data",
  },
  {
    icon: <RxPencil2 />,
    title: "Design",
    description:
      "I design clear interfaces for complex data products, so operators can act on exceptions instead of raw tables.",
    link: "/contact?id=design",
  },
  {
    icon: <SiWebpack />,
    title: "Website Development",
    description:
      "I build fast, accessible web products, including this portfolio and client-facing dashboards.",
    link: "/contact?id=website",
  },
  {
    icon: <RxReader />,
    title: "Copywriting",
    description:
      "I write clear, conversion-focused copy for technical products and data platforms.",
    link: "/contact?id=copywriting",
  },
  {
    icon: <RxDesktop />,
    title: "Application Development",
    description:
      "I build cross-platform apps that improve engagement and reduce time-to-value.",
    link: "/contact?id=application",
  },
];

const ServiceSlider = () => {
  return (
    <Swiper
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 15,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      }}
      freeMode={true}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Pagination]}
      className="h-[240px] sm:h-[340px]"
    >
      {serviceData.map((item) => {
        return (
          <SwiperSlide key={item.link}>
            <Link
              href={item.link}
              className="flex bg-[rgba(65,47,123,0.15)] rounded-lg px-6 py-8 sm:flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,6,169,0.15)] transition-all duration-300"
            >
              {/* Icons */}
              <div aria-hidden="true" className="mb-4 text-4xl text-accent">
                {item.icon}
              </div>
              {/* title & desc */}
              <div className="mb-8">
                <div className="mb-2 text-lg">{item.title}</div>
                <p className="max-w-[350px] leading-normal">
                  {item.description}
                </p>
              </div>
              {/* Arrow */}
              <div aria-hidden="true" className="text-3xl">
                <RxArrowTopRight className="transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ServiceSlider;
