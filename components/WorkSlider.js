import { BsArrowRight } from "react-icons/bs";

import { Swiper, SwiperSlide } from "swiper/react";

import { useRouter } from "next/router";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { Pagination } from "swiper";

import Image from "next/image";

// data
const workSlides = {
  slides: [
    {
      images: [
        {
          title: "title",
          path: "/tickerApp.png",
          bool: false,
        },
        {
          title: "title",
          path: "/tedTicket.png",
          bool: true,
        },
        {
          title: "title",
          path: "/locus.png",
          bool: false,
        },
        {
          title: "title",
          path: "/expense.png",
          bool: true,
        },
      ],
    },
    {
      images: [
        {
          title: "title",
          path: "/Myshopapp.png",
          bool: true,
        },
        {
          title: "title",
          path: "/client.png",
          bool: true,
        },
        {
          title: "title",
          path: "/firscv.png",
          bool: true,
        },
        {
          title: "title",
          path: "/admin.png",
          bool: true,
        },
      ],
    },
    {
      images: [
        {
          title: "title",
          path: "/mernshop.png",
          bool: true,
        },
        // {
        //   title: "title",
        //   path: "/thumb1photo.jpg",
        //   bool: true,
        // },
        // {
        //   title: "title",
        //   path: "/thumb2photo.jpg",
        //   bool: false,
        // },
        // {
        //   title: "title",
        //   path: "/thumb5photo.jpg",
        //   bool: false,
        // },
      ],
    },
  ],
};

const WorkSlider = () => {
  const router = useRouter();
  return (
    <Swiper
      spaceBetween={10}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="h-[280px] sm:h-[480px]"
    >
      {workSlides.slides.map((slide, slideIndex) => {
        return (
          <SwiperSlide
            key={slideIndex}
            // onClick={() => router.push("/contact")}
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-4 bg-cover cursor-pointer">
              {slide.images.map((image, index) => {
                return (
                  <div
                    key={index}
                    className="relative flex items-center justify-center overflow-hidden rounded-lg group"
                  >
                    <div className="relative flex items-center justify-center overflow-hidden group">
                      {/* Image */}
                      <Image
                        src={image.path}
                        alt={image.title}
                        width={500}
                        height={500}
                        className="object-cover transition-all duration-700 bg-cover"
                      />

                      {/* overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-l from-[#229389] via-[#57C3AD] to-[#229389] opacity-0 group-hover:opacity-80 transition-all duration-700"></div>
                      <div className="absolute bottom-0 transition-all duration-300 translate-y-full group-hover:xl:-translate-y-20">
                        <div className="flex items-center gap-x-2 text-[13px] tracking-[0.2rem]">
                          {/* title */}
                          <div className="delay-100">
                            {image.bool === true ? "COMPLETED" : "LIVE"}
                          </div>
                          <div className="translate-y-[500%] group-hover:translate-y-0 transition-all duration-300 delay-150">
                            {image.bool === true ? "" : "PROJECT"}
                          </div>
                          {/* icon */}
                          <div className="text-xl translate-y-[500%] group-hover:translate-y-0 transition-all duration-300">
                            <BsArrowRight />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default WorkSlider;
