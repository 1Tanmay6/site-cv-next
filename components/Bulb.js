import Image from "next/image";

const Bulb = () => {
  return (
    <div className="absolute -left-32 -bottom-5 rotate-0 mix-blend-color-dodge animate-pulse duration-300 z-10 w-[200px] xl:w-[260px]">
      <Image src={"/bulb.png"} width={1000} height={1000} alt="" />
    </div>
  );
  avatar;
};

export default Bulb;
