import React from "react";
import parkvideo from "../assets/frontend_assets/HomeSlides/photoparkk Video.mp4";
import Frame4 from "../assets/frontend_assets/BestSellers/Frame4.jpg";
import machine1 from "../assets/frontend_assets/About/machine1.jpg";
import machine2 from "../assets/frontend_assets/About/machine2.jpg";
import machine3 from "../assets/frontend_assets/About/machine3.jpg"


const About = () => {
  return (
    <div>
      <div className="relative w-full h-140 overflow-hidden">
        {/* Landing Page Background Video */}

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={parkvideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>


      {/* 1nd Slide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-xl border-1">
        {/* left */}
        <div className="relative border pb-10 bg-white">
          <img
            src={machine2}
            alt="Machine"
            className=" object-contain"
          />
        </div>
        {/* Right */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6 leading-tight">
            Machine Heading
          </h1>
          <p className="text-md text-gray-700 mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi,
            nostrum quidem. Ipsa eius fuga enim quis dolor, mollitia iure
            voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam adipisci optio ad animi repellendus nam numquam fugiat
            accusamus pariatur ut.
          </p>
          <button className="px-6 py-3 text-white bg-gray-900 hover:bg-gray-800 text-lg rounded-lg transition duration-300 shadow-md w-max">
            Learn More
          </button>
        </div>
      </div>

      {/* 2nd Slide */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-xl border-1">
        {/* Left (Text) */}
        <div className="bg-white p-10 flex flex-col justify-center order-2 md:order-1">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6 leading-tight">
            Machine Heading
          </h1>
          <p className="text-md text-gray-700 mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi,
            nostrum quidem. Ipsa eius fuga enim quis dolor, mollitia iure
            voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam adipisci optio ad animi repellendus nam numquam fugiat
            accusamus pariatur ut.
          </p>
          <button className="px-6 py-3 text-white bg-gray-900 hover:bg-gray-800 text-lg rounded-lg transition duration-300 shadow-md w-max">
            Learn More
          </button>
        </div>

        {/* Right (Image with overlay) */}
        <div className="relative order-1 md:order-2 border">
          <img
            src={machine3}
            alt="Machine"
            className="w-full h-full object-cover"
          />
          
        </div>
      </div>

      {/* 3nd Slide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-xl border-1 mb-10">
        {/* left */}
        <div className="relative bg-white border pb-10">
          <img
            src={machine1}
            alt="Machine"
            className=" object-contain"
          />
          
        </div>
        {/* Right */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6 leading-tight">
            Machine Heading
          </h1>
          <p className="text-md text-gray-700 mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi,
            nostrum quidem. Ipsa eius fuga enim quis dolor, mollitia iure
            voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam adipisci optio ad animi repellendus nam numquam fugiat
            accusamus pariatur ut.
          </p>
          <button className="px-6 py-3 text-white bg-gray-900 hover:bg-gray-800 text-lg rounded-lg transition duration-300 shadow-md w-max">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
