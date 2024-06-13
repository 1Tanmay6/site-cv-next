import { FaQuoteLeft } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";

import { useRouter } from "next/router";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper";

import Image from "next/image";
// testimonial data
const testimonialData = [
  {
    image: "/t-avt-1.png",
    name: "Anne Smith",
    position: "Customer",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum expedita odit beatae, cupiditate saepe quam officia aut placeat quas neque!",
  },
  {
    image: "/t-avt-2.png",
    name: "Jane Doe",
    position: "Customer",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum expedita odit beatae, cupiditate saepe quam officia aut placeat quas neque!",
  },
  {
    image: "/t-avt-3.png",
    name: "Jhon Doe",
    position: "Customer",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum expedita odit beatae, cupiditate saepe quam officia aut placeat quas neque!",
  },
];

const TestimonialSlider = () => {
  const router = useRouter();
  return (
    <div>No testimonials yet</div>
    // <Swiper
    //   navigation={true}
    //   pagination={{
    //     clickable: true,
    //   }}
    //   modules={[Navigation, Pagination]}
    //   className="h-[400px]"
    // >
    //   {testimonialData.map((person, slideIndex) => {
    //     return (
    //       <SwiperSlide
    //         key={slideIndex}
    //         // onClick={() => router.push("/contact")}
    //       >
    //         <div className="flex flex-col items-center h-full px-16 md:flex-row gap-x-8">
    //           {/* avatar, name, ppostion  */}
    //           <div className="w-full max-w-[300px] flex flex-col xl:justify-center items-center relative mx-auto xl:mx-0">
    //             <div className="flex flex-col justify-center text-center">
    //               {/* avatar */}
    //               <div className="mx-auto mb-2 ">
    //                 <Image
    //                   src={person.image}
    //                   alt={person.name}
    //                   width={100}
    //                   height={100}
    //                 />
    //               </div>
    //               {/* name */}
    //               <div className="text-lg">{person.name}</div>
    //               {/* position */}
    //               <div className="text-[12px] uppercase font-extralight tracking-widest">
    //                 {person.position}
    //               </div>
    //             </div>
    //           </div>
    //           {/* quote & messgae */}
    //           <div
    //             className="flex flex-col justify-center flex-1 before:w-[1px] x;:before:bg-white/20
    //           xl:before:absolute xl:before:left-0 xl:before:h-[200px] relative xl:pl-20"
    //           >
    //             {/* quote icon */}
    //             <div className="mb-4">
    //               <FaQuoteLeft className="mx-auto text-4xl xl:text-6xl text-white/20 md:mx-0" />
    //             </div>
    //             {/* message */}
    //             <div className="text-center xl:text-lg md:text-left">
    //               {person.message}
    //             </div>
    //           </div>
    //         </div>
    //       </SwiperSlide>
    //     );
    //   })}
    // </Swiper>
  );
};

export default TestimonialSlider;
