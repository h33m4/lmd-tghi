"use client";
import React from "react";
import Link from "next/link";

// icons
import LMHLogo from "../../../public/assets/brand/lmh-dark.svg";
import FacebookIcon from "../../../public/assets/icons/socials/Facebook.svg";
import InstagramIcon from "../../../public/assets/icons/socials/Instagram.svg";
import LinkedInIcon from "../../../public/assets/icons/socials/Linkedin.svg";
import TwitterIcon from "../../../public/assets/icons/socials/Twitter.svg";
import { TourWrapper } from "@/context/tourContext";

const NavTitle = ({ text }: { text: string }) => {
  return (
    <h1 className="text-lmh-blue uppercase th-font-heavy tracking-wider text-md">
      {text}
    </h1>
  );
};

const socialLinks = {
  facebook: "https://www.facebook.com/lastmilehealth",
  twitter: "https://twitter.com/lastmilehealth",
  linkedIn: "https://www.linkedin.com/company/last-mile-health",
  instagram: "https://www.instagram.com/lastmilehealth",
};

const otherLinks = {
  lmhWebsite: "https://lastmilehealth.org/",
};

const NavLink = ({
  href,
  text,
  smallTextSize = false,
  target,
  rel,
}: {
  href: string;
  text: string;
  smallTextSize?: boolean;
  rel?: string;
  target?: React.HTMLAttributeAnchorTarget;
}) => {
  return (
    <Link href={href} rel={rel} target={target}>
      <p
        className={`${
          smallTextSize ? "th-text-size-small" : "th-text-size"
        } th-font-roman underline-hover w-fit`}
      >
        {text}
      </p>
    </Link>
  );
};

const IconButton = ({ href, Icon }: { href: string; Icon: any }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer transform hover:translate-y-[-5px] transition duration-300 ease-in-out"
    >
      <div className="w-8 h-8 flex items-center justify-center">{Icon}</div>
    </Link>
  );
};

const Footer = () => {
  return (
    <div className="w-full h-fit bg-lmh-dark-blue dark:bg-background text-white border-t-4 border-primary  ">
      <div className="web-page-constraints pt-20 grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-5">
        <div className="col-span-2 ">
          <LMHLogo />
          <div className="flex flex-col -gap-0.5 mt-3 th-font-medium">
            <h1 className="text-green th-text-size-medium">
              Last Mile Data Portal (LMD 2.0)
            </h1>
            <p className="th-font-light th-text-size max-w-md tracking-wider">
              A programmatic data management & reporting platform for Last Mile
              Health
            </p>
          </div>

          <div className="mt-10  flex-col hidden md:flex">
            <NavTitle text="Connect with us" />
            <div className="flex gap-3 mt-2 ">
              <IconButton
                Icon={<FacebookIcon className="social-icon w-8 h-8" />}
                href={socialLinks.facebook}
              />
              <IconButton
                Icon={<TwitterIcon className="social-icon w-6 h-6 -mb-2" />}
                href={socialLinks.twitter}
              />
              <IconButton
                Icon={<LinkedInIcon className="social-icon w-8 h-8" />}
                href={socialLinks.linkedIn}
              />
              <IconButton
                Icon={<InstagramIcon className="social-icon w-8 h-8" />}
                href={socialLinks.instagram}
              />
            </div>
          </div>
        </div>

        <TourWrapper
          tourRef="tour_useful_links"
          className="col-span-2 grid grid-cols-2"
        >
          <div className="boder">
            <NavTitle text="ABOUT LMD 2.0" />
            <div className="flex flex-col gap-[3px] mt-2">
              <NavLink text="What is LMD 2.0 ?" href="/docs/about-lmd2" />
              <NavLink text="User Guides" href="/docs/user-guides" />
              <NavLink text="FAQs" href="/docs/faqs" />
            </div>
          </div>

          <div className="">
            <NavTitle text="Useful links" />
            <div className="flex flex-col gap-[3px] mt-2">
              <NavLink text="Sitemap" href="/site-map" />
              {/* <NavLink text="Disclaimer" href="/" /> */}
              <NavLink
                text="LMH Website"
                href={otherLinks.lmhWebsite}
                target={"_blank"}
                rel="noopener noreferrer"
              />
            </div>
          </div>
        </TourWrapper>

        <div className=" col-span-2 md:col-span-1">
          <NavTitle text="Contact Us" />

          <div className="th-text-size th-font-roman flex flex-col gap-2 mt-2">
            <p>lmdadmin@lastmilehealth.org</p>
            {/* <p>+1 (857) 447-7322</p> */}
            <p>
              No. 30A Boundary Road,
              <br /> East Legon, Accra
              <br /> Ghana
            </p>
          </div>
        </div>

        <div className=" col-span-2 flex-col flex md:hidden">
          <NavTitle text="Connect with us" />
          <div className="flex gap-3 mt-2">
            <IconButton
              Icon={<FacebookIcon className="social-icon w-8 h-8" />}
              href={socialLinks.facebook}
            />
            <IconButton
              Icon={<TwitterIcon className="social-icon w-8 h-8" />}
              href={socialLinks.twitter}
            />
            <IconButton
              Icon={<LinkedInIcon className="social-icon w-8 h-8" />}
              href={socialLinks.linkedIn}
            />
            <IconButton
              Icon={<InstagramIcon className="social-icon w-8 h-8" />}
              href={socialLinks.instagram}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#C1C1C1] web-page-constraints py-1.5 flex flex-col md:flex-row justify-between mt-12 gap-1">
        <p className="th-text-size th-font-light flex items-center justify-center">
          © 2024 - Last Mile Health
          {/* <span className="mx-3">|</span> */}
          {/* <NavLink text="Privacy Policy" href="/" smallTextSize={false} /> */}
        </p>
        <div className="flex md:justify-between items-center justify-center gap-3">
          <NavLink
            text="Privacy Policy"
            href="/privacy-policy"
            smallTextSize={false}
            target={"_blank"}
            rel="noopener noreferrer"
          />
          {/* | */}
          {/* <NavLink text="Terms & Conditions" href="/" smallTextSize={false} /> */}
        </div>
      </div>
    </div>
  );
};

export default Footer;
