"use client";
import React, { useEffect, useState } from "react";
import SignIn from "../auth/signin/page";

const HomePage: React.FC = () => {
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [marriageDate, setMarriageDate] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  React.useEffect(() => {
    const brideName = sessionStorage.getItem("brideName") || "";
    const groomName = sessionStorage.getItem("groomName") || "";
    const marriageDate = sessionStorage.getItem("marriageDate") || "";
    setBrideName(brideName);
    setGroomName(groomName);
    setMarriageDate(marriageDate);
  }, []);

  return (
    <div className="h-screen">
      <header className="bg-headerBdr sticky top-0 z-999 flex h-15 w-full border-stroke bg-white bg-cover bg-center bg-no-repeat dark:border-stroke-dark dark:bg-gray-dark"></header>
      {/* <div className="flex flex-wrap items-center h-screen"></div> */}
      <div className="flex items-center justify-center bg-white pt-5">
        <h2 className="text-heading-3 font-medium text-dark dark:text-white">
          {brideName}{" "}
        </h2>
        <h2 className="ml-5 mr-5 text-heading-2 font-medium text-dark dark:text-white">
          {brideName ? "&" : ""}
          {" "}
        </h2>
        <h2 className="text-heading-3 font-medium text-dark dark:text-white">
          {groomName}
        </h2>
      </div>
      <div className="flex items-center justify-center bg-white pb-5">
        <h2 className="text-heading-4 font-medium text-dark dark:text-white">
          {marriageDate}
        </h2>
      </div>
      <SignIn />
      {/* <div className="flex flex-wrap items-center h-screen"></div> */}

      <footer className="bg-footerBdr sticky top-0 z-999 flex h-15 w-full border-stroke bg-white bg-cover bg-center bg-no-repeat dark:border-stroke-dark dark:bg-gray-dark"></footer>
    </div>
  );
};

export default HomePage;
