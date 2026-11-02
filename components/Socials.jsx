import Link from "next/link";

import {
  RiInstagramLine,
  RiLinkedinLine,
  RiFacebookLine,
  RiGithubLine,
} from "react-icons/ri";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tanmay-patil-181820177",
    icon: <RiLinkedinLine />,
  },
  {
    label: "GitHub",
    href: "https://github.com/1Tanmay6",
    icon: <RiGithubLine />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/tanmay_p.16/",
    icon: <RiInstagramLine />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/tanmay.patil.75436531?mibextid=D4KYlr",
    icon: <RiFacebookLine />,
  },
];

const Socials = () => {
  return (
    <div className="flex flex-row text-lg gap-x-5">
      {socialLinks.map((social) => (
        <Link
          key={social.label}
          href={social.href}
          aria-label={social.label}
          rel="noopener noreferrer"
          className="transition-all duration-300 hover:text-accent"
        >
          <span aria-hidden="true">{social.icon}</span>
        </Link>
      ))}
    </div>
  );
};

export default Socials;
