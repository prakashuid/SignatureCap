'use client'

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import topLeft from "../../../../public/images/CustImages/Topleft.png";
import BottomLeft from "../../../../public/images/CustImages/BottomLeft.png";
import bottomRight from "../../../../public/images/CustImages/BottomRight.png";
import SignatureCanvas from "react-signature-canvas";
import confetti from "canvas-confetti";
import { Camera } from "react-camera-pro";
import bandgPhoto from "../../../../public/images/CustImages/BandG.png";
import { useRouter } from "next/navigation";


interface CameraRef {
  takePhoto: () => string;
  // Add any other necessary methods or properties
}


const SignIn: React.FC = () => {

  const canvasRef = useRef(null);
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const camera = useRef<CameraRef | null>(null);
  const router = useRouter();

  const [isSignatureReady, setIsSignatureReady] = useState(false);

  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [ratio, setRatio] = useState(6/6);
  const [brideAndGoomImage, setBrideAndGoomImage] = useState<string | null>(null);
  const confettiDefaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

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

  useEffect(() => {
    if (sigCanvas.current) {
      setIsSignatureReady(true);
    }
  }, [sigCanvas]);

  React.useEffect(() => {

    const uploadedPhoto = sessionStorage.getItem("uploadedPhoto");
    setBrideAndGoomImage(uploadedPhoto);

  }, []);

  const signature =
    "https://my-blob-store.public.blob.vercel-storage.com/signature-1633660730000-100000000.png";

  const capture = () => {
    if (camera.current) {
      const imageSrc = camera.current.takePhoto();
      if (!imageSrc) {
        console.error("Failed to capture image.");
        return;
      }
      rotateImage(imageSrc, 90, (rotatedImage: string) => {
        const base64Data = rotatedImage.split(",")[1];
        setImage(base64Data);
      });
    } else {
      console.error("Camera is not initialized.");
    }
  };

  const rotateImage = (imageBase64: any, rotation: any, cb: any) => {
    const img = new window.Image();
    img.src = imageBase64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0);
        cb(canvas.toDataURL("image/jpeg"));
      } else {
        console.error("Failed to get 2D context.");
      }
    };
  };

  const imageCamera = {
    position: "absolute",
    bottom: "10%",
  };

  const errorMessages = {
    noCameraAccessible: "No camera found",
    permissionDenied: "Camera is not accessible",
    // Add other error messages as needed
  };

  const handleConfetti = () => {
    confetti({
      ...confettiDefaults,
      particleCount: 140,
      scalar: 2.2,
      shapes: ["star"],
    });

    confetti({
      ...confettiDefaults,
      particleCount: 110,
      scalar: 0.75,
      shapes: ["circle"],
    });
  };


  const saveSignature = async () => {
    handleConfetti();

    try {
      // Capture the image
      const imageSrc = camera.current ? camera.current.takePhoto() : null;
      if (!imageSrc) {
        console.error("Camera is not initialized.");
        return;
      }
      const rotatedImage = await new Promise((resolve, reject) => {
        rotateImage(imageSrc, 90, (result: any) => {
          const base64Data = result.split(",")[1]; // Extract Base64 data
          if (base64Data) {
            resolve(base64Data);
          } else {
            reject(new Error("Failed to capture image"));
          }
        });
      });

      const imageData = sigCanvas.current
        ? sigCanvas.current.getTrimmedCanvas().toDataURL("image/png").split(",")[1]
        : null;

      if (!imageData) {
        console.error("Signature canvas is not initialized.");
        return;
      }

      console.log("Captured image:", rotatedImage);
      console.log("Signature image:", imageData);

      const newSignature = {
        image: imageData,
        capImage: rotatedImage,
      };

      const response = await fetch("/api/file", {
        method: "POST",
        body: JSON.stringify(newSignature),
      });

      if (response.ok) {
        await response.json();
        if (sigCanvas.current) {
          sigCanvas.current.clear();
        }
      } else {
        console.error("Failed to upload signature");
      }
    } catch (error) {
      console.error("Error capturing or uploading signature:", error);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    } else {
      console.error("Signature canvas is not initialized.");
    }
  };

  const settingsHandler = () => {
    router.push('/settings');
  }
  return (
    <div className="bg-[#f0b9d8] h-screen" >
      <div className=" ">

        <div className="relative w-full h-screen bg-pink-200">
          {/* Top Section with blue background */}
          <div className="bg-teal-300 h-[300px] w-full relative flex items-center justify-center z-0">
            {/* Decorative floral top-left */}
            <div className="absolute -top-40 -left-32">
              <Image
                src={topLeft}
                alt="Logo"
                width={500}
                height={400}
              />
            </div>

            {/* Circle in the middle */}
            <div className="w-60 h-60 bg-pink-300 rounded-full">
              <Camera
                ref={camera}
                numberOfCamerasCallback={setNumberOfCameras}
                facingMode="user"
                aspectRatio={ratio}
                errorMessages={errorMessages} 
                 
              />
            </div>

            {/* Decorative lines top-right */}
            {/* <div className="absolute top-20 right-4 space-y-6 ">
          <div className="w-60 h-1 bg-pink-600"></div>
          <div className="w-60 h-1 bg-pink-600"></div>
          <div className="w-60 h-1 bg-pink-600"></div>
          <div className="w-30 h-1 bg-pink-600"></div>
        </div> */}
          </div>

          {/* "Wishes" Text Section */}
          <div className="text-center mt-4">
            <h1 className="text-6xl font-bold text-white z-99">WISHES</h1>
          </div>

          {/* Main Content Area */}


          {/* Placeholder for content */}
          <div className="rounded-lg  p-4">
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                width: 850,
                height: 900,
                className: "sigCanvas",
              }}
            />
          </div>


          {/* Bottom Section */}
          <div className="absolute -bottom-5 -left-40">

            <Image
              src={BottomLeft}
              alt="Logo"
              width={550}
              height={600}
            />

          </div>
          <div className=" absolute -bottom-0 left-0">
            <Image
              src={brideAndGoomImage ? brideAndGoomImage : bandgPhoto}
              alt="Logo"
              width={500}
              height={600}
              className=" w-[300px] h-[400px]"
            />
          </div>


          <div className="absolute -bottom-10 -right-10 -mr-3 ">
            <Image
              src={bottomRight}
              alt="Logo"
              width={300}
              height={300}
            />
          </div>
          <div className=" absolute w-full flex justify-center -mt-2" >
          <button className="bg-myButton lg:w-[135px] lg:h-[42px] md:w-[100px] md:h-[40px] bg-cover bg-center bg-no-repeat text-white rounded-2xl font-bold mr-5" 
                       onClick={clearSignature}

         >Clear</button>
          <button className="bg-myButton lg:w-[135px] lg:h-[42px] md:w-[100px] md:h-[40px] bg-cover bg-center bg-no-repeat text-white rounded-2xl font-bold mr-5" onClick={() => {
                saveSignature();
                capture();
              }}>Save</button>
               <button className="bg-myButton lg:w-[135px] lg:h-[42px] md:w-[100px] md:h-[40px] bg-cover bg-center bg-no-repeat text-white rounded-2xl font-bold" onClick={() => {
                settingsHandler()
              }}>Settings</button>
          </div>
        </div>

       

      </div>
    </div>
  );
};

export default SignIn;


