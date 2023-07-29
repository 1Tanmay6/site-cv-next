import Link from "next/link";

import {
  RiInstagramLine,
  RiLinkedinLine,
  RiFacebookLine,
  RiGithubLine,
} from "react-icons/ri";

const Socials = () => {
  return (
    <div className="flex flex-row text-lg gap-x-5">
      <Link
        href={"https://www.linkedin.com/in/tanmay-patil-181820177"}
        className="transition-all duration-300 hover:text-accent"
      >
        <RiLinkedinLine />
      </Link>
      <Link
        href={"https://github.com/1Tanmay6"}
        className="transition-all duration-300 hover:text-accent"
      >
        <RiGithubLine />
      </Link>
      <Link
        href={"https://www.instagram.com/tanmay_p.16/"}
        className="transition-all duration-300 hover:text-accent"
      >
        <RiInstagramLine />
      </Link>
      <Link
        href={"https://www.facebook.com/tanmay.patil.75436531?mibextid=D4KYlr"}
        className="transition-all duration-300 hover:text-accent"
      >
        <RiFacebookLine />
      </Link>
    </div>
  );
};

export default Socials;
