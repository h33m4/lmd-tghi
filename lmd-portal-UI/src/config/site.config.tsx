import { Metadata } from "next";
// import logoImg from "@public/logo.svg";
// import logoIconImg from "@public/logo-short.svg";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

enum MODE {
  DARK = "dark",
  LIGHT = "light",
}

export const siteConfig = {
  title: "LMD 2.0 ",
  description: `A programmatic data management & reporting platform for Last Mile Health`,
  //   logo: logoImg,
  //   icon: logoIconImg,
  mode: MODE.LIGHT,
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `LMD 2.0 - ${title}` : siteConfig.title,
    description,
    // openGraph: openGraph ?? {
    //   title: title ? `LMD 2.0 - ${title} ` : title,
    //   description,
    //   url: "https://main.d1gfzcw5a606s8.amplifyapp.com",
    //   siteName: "LastMileData-2.0", // https://developers.google.com/search/docs/appearance/site-names
    //   //   images: {
    //   //     url: "image url",
    //   //     width: 1200,
    //   //     height: 630,
    //   //   },
    //   locale: "en_US",
    //   type: "website",
    // },
  };
};
