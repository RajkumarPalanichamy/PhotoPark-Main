import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserSquare,
  Image as ImageIcon,
  Square,
  Heart,
  Hexagon,
  Circle,
  ChevronRight,
} from "lucide-react";
import AcrylicBanner from "../../assets/frontend_assets/CanvasCustomized/AcrylicBanner.jpg";

const shapeData = [
  {
    name: "Portrait",
    icon: <UserSquare className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600" />,
    route: "/AcrylicPortrait",
  },
  {
    name: "Landscape",
    icon: <ImageIcon className="w-12 h-12 sm:w-14 sm:h-14 text-green-600" />,
    route: "/AcrylicLandscape",
  },
  {
    name: "Square",
    icon: <Square className="w-12 h-12 sm:w-14 sm:h-14 text-purple-600" />,
    route: "/AcrylicSquare",
  },
  {
    name: "Love",
    icon: <Heart className="w-12 h-12 sm:w-14 sm:h-14 text-pink-600" />,
    route: "/AcrylicLove",
  },
  {
    name: "Hexagon",
    icon: <Hexagon className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-600" />,
    route: "/AcrylicHexagon",
  },
  {
    name: "Round",
    icon: <Circle className="w-12 h-12 sm:w-14 sm:h-14 text-red-600" />,
    route: "/AcrylicRound",
  },
];

const steps = ["Select Shape", "Upload Image", "Place Order"];

function CustomizeSteps() {
  const navigate = useNavigate();

  return (
    <div className="mt-10 w-full font-[Poppins] px-20 ">
      {/* Step Indicator */}
      <div className="text-center font-extrabold text-2xl sm:text-3xl xl:text-4xl">
        <h1>Acrylic Frame</h1>
        <p className="text-lg text-gray-600  mt-5">
          Customize Your Acrylic Photo Frame
        </p>
        {/* Acrylic Banner Image */}
        <img
          src={AcrylicBanner}
          alt="Acrylic Frame Banner"
          className="mx-auto mt-6 rounded-xl shadow-xl w-full"
        />

        <p className="font-bold text-2xl mt-20">
          Pick the Acrylic Frames For You !
        </p>
      </div>

      <div className="flex flex-col mt-10 sm:flex-row justify-center items-center gap-6 md:gap-8 xl:gap-16 2xl:gap-20 mb-8 text-sm sm:text-base xl:text-xl 2xl:text-2xl font-semibold text-gray-800">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center">
              {index + 1}
            </div>
            <p className="text-center">{label}</p>
          </div>
        ))}
      </div>

      {/* Acrylic Customized Shapes */}

      <div className=" mt-10  grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 text-center">
        {shapeData.map((shape, index) => (
          <div
            key={index}
            onClick={() => navigate(shape.route)}
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
            }}
            className="h-60 w-full flex flex-col items-center justify-center p-15 rounded-2xl transition-all duration-300 ease-in-out bg-white hover:scale-105"
          >
            <div className="text-5xl mb-2">{shape.icon}</div>
            <button className="flex items-center justify-center gap-2 text-gray-800 font-medium text-sm sm:text-base">
              <p>{shape.name}</p>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomizeSteps;
