import {
  RxCrop,
  RxPencil2,
  RxDesktop,
  RxReader,
  RxRocket,
  RxArrowTopRight,
} from "react-icons/rx";

import { SiWebpack } from "react-icons/si";

import { Swiper, SwiperSlide } from "swiper/react";

import { useRouter } from "next/router";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { FreeMode, Pagination } from "swiper";
// data
const serviceData = [
  {
    icon: <RxRocket />,
    title: "Data Driven Solutions",
    description:
      "I help you analysis and create a solution with the newest Generative AI.",
    link: "/contact?id=branding",
  },
  {
    icon: <RxPencil2 />,
    title: "Design",
    description:
      "I provide visually stunning designs that capture the essence of your brand and engage your audience.",
    link: "/contact?id=design",
  },
  {
    icon: <SiWebpack />,
    title: "Website Development",
    description:
      "I build robust and scalable digital solutions to help you achieve your business goals.",
    link: "/contact?id=website",
  },
  {
    icon: <RxReader />,
    title: "Copywriting",
    description:
      "I craft compelling copy that effectively communicates your message and drives action.",
    link: "/contact?id=copywriting",
  },
  {
    icon: <RxDesktop />,
    title: "Application Development",
    description:
      "I optimize your app's UI to enhance user experience and increase engagement.",
    link: "/contact?id=application",
  },
];

import Image from "next/image";

const ServiceSlider = () => {
  const router = useRouter();
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
      {serviceData.map((item, index) => {
        return (
          <SwiperSlide key={index} onClick={() => router.push(item.link)}>
            <div className="bg-[rgba(65,47,123,0.15)] rounded-lg px-6 py-8 flex sm:flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,6,169,0.15)] transition-all duration-300">
              {/* Icons */}
              <div className="mb-4 text-4xl text-accent">{item.icon}</div>
              {/* title & desc */}
              <div className="mb-8">
                <div className="mb-2 text-lg">{item.title}</div>
                <p className="max-w-[350px] leading-normal">
                  {item.description}
                </p>
              </div>
              {/* Arrow */}
              <div className="text-3xl">
                <RxArrowTopRight className="transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ServiceSlider;
