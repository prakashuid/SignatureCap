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
      <SignIn /> 
    </div>
  );
};

export default HomePage;
