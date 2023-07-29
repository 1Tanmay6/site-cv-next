import Image from "next/image";

const Avatar = () => {
  return (
    <div className="hidden xl:flex xl: max-w-none">
      <Image
        src={"/avatar.png"}
        width={1000}
        height={1000}
        alt=""
        className=""
      />
    </div>
  );
};

export default Avatar;
