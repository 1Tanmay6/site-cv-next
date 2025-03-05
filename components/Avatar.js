import Image from "next/image";

const Avatar = () => {
  return (
    <div className="flex">
  <div className="ml-auto hidden xl:flex xl:max-w-none">
    <Image
      src={"/avatar-min.png"}
      width={2000}
      height={2000}
      alt=""
      className=""
    />
  </div>
</div>


  );
};

export default Avatar;
