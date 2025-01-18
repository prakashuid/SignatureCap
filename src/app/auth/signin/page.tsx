'use client';
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import Buttons from "@/app/ui-elements/buttons/page";
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

  const [camCapture, setCamCapture] = useState(true);
  const [isSelected, setIsSelected] = useState(true);
  const [isSelectedSign, setIsSelectedSign] = useState(true);
  const [isSignatureReady, setIsSignatureReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [ratio, setRatio] = useState(11 / 5);
  const [brideAndGoomImage, setBrideAndGoomImage] = useState<string | null>(null);
  const confettiDefaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };


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
        rotateImage(imageSrc, 90, (result:any) => {
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
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-center items-center align-middle">
        <div className="w-full  p-5 sm:w-1/2 xl:w-1/2">
          <div className=" bg-bandgBg bg-cover bg-center bg-no-repeat overflow-hidden rounded-2xl h-[652px] flex justify-center items-center text-center  align-middle ">
            <Image
                src={brideAndGoomImage ? brideAndGoomImage : bandgPhoto}
                alt="Logo"
                width={300} 
                height={400}
                className=" w-[300px] h-[400px]"
              />
          </div>
        </div>

        <div className="hidden w-full p-7.5 sm:block sm:w-1/2 xl:block  xl:w-1/2 ">
        <div className="flex flex-col jsutify-center text-center items-center align-middle">
        {/* <div className="w-full bg-myCamBg text-center lg:h-56 md:h-56  bg-cover bg-center bg-no-repeat mt-10">
       <div className="w-[300px] ml-19 mt-11 md:w-[430px] md:ml-30 md:mt-3">
       <Camera
            ref={camera}
            numberOfCamerasCallback={setNumberOfCameras}
            facingMode="user"
            aspectRatio={ratio}
          />
       </div>
       
        </div> */}

  <div className="flex justify-center items-center">
  <div className="w-[370px] z-1 rounded-2xl  ">
  <div className="bg-myCamBg text-center bg-cover bg-center bg-no-repeat absolute  w-[535px] h-[170px] -ml-20 rounded-2xl z-99"></div>
 

<Camera
  ref={camera}
  numberOfCamerasCallback={setNumberOfCameras}
  facingMode="user"
  aspectRatio={ratio}
  errorMessages={errorMessages}  // Provide the required prop here
/>
    
    </div>
  </div>

          <div className="w-full  sm:p-12.5 xl:p-15 bg-mySignPadbg bg-cover bg-center bg-no-repeat h-80 mt-2 rounded-2xl">
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                width: 550,
                height:256,
                className: "sigCanvas",
              }}
            />
          </div>
          <div className="w-full flex justify-end mt-5" >
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
    </div>
  );
};



export default SignIn;
