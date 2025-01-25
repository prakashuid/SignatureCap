import ECommerce from "@/components/Dashboard/E-commerce";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import HomePage from "./home/page";
import React from "react";


export const metadata: Metadata = {
  title: "Sign Cap",
  description: "It's a simple progressive web application made with Drizzeal by Prakash",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["Prakash", "ARP", "drizzeal", "drizeal"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "images/icon/icon512_maskable.png" },
    { rel: "icon", url: "images/icon/icon512_rounded.png" },
  ],
};


export default function Home() {
  return (
    <>
    <div>
      <HomePage />
    </div>
      {/* <DefaultLayout>
        <ECommerce />
      </DefaultLayout> */}
    </>
  );
}
