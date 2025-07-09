import React from "react";
import machine1 from "../assets/frontend_assets/About/machine1.jpg";
import machine2 from "../assets/frontend_assets/About/machine2.jpg";
import machine3 from "../assets/frontend_assets/About/machine3.jpg";
import machine4 from "../assets/frontend_assets/About/machine4.jpg";
import machine5 from "../assets/frontend_assets/About/machine5.jpg";

const About = () => {
  return (
    <div className="bg-white">
      {/* Video Section with Border and Centered Text */}
      <div className="relative w-full h-[600px] border-4 border-gray-600 rounded-3xl overflow-hidden shadow-2xl ">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Centered Text Overlay */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-white bg-black/40 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">
            Advanced Machinery In Action
          </h1>
          <p className="max-w-2xl text-lg md:text-xl font-medium drop-shadow-md">
            Witness our state-of-the-art production process delivering
            precision-crafted frames with unmatched quality.
          </p>
        </div>
      </div>

      {/* Slide 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-xl border-1">
        {/* Left */}
        <div className="relative border pb-10 bg-white">
          <img
            src={machine2}
            alt="Machine"
            className="object-contain w-full h-full"
          />
        </div>
        {/* Right */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6 leading-tight">
            Precision Engineering
          </h1>
          <p className="text-md text-gray-700 mb-6 leading-relaxed">
            We use cutting-edge technology to ensure accuracy and quality in
            every frame. From concept to creation, our machines handle it all
            with unmatched precision.
          </p>
        </div>
      </div>

      {/* Slide 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-xl border-1">
        {/* Left (Text) */}
        <div className="bg-white p-10 flex flex-col justify-center order-2 md:order-1">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6 leading-tight">
            Seamless Fabrication
          </h1>
          <p className="text-md text-gray-700 mb-6 leading-relaxed">
            Our automated systems ensure every frame is fabricated with
            consistent strength and style. The process is fast, reliable, and
            fully scalable.
          </p>
        </div>

        {/* Right (Image) */}
        <div className="relative order-1 md:order-2 border">
          <img
            src={machine4}
            alt="Machine"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Slide 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-xl border-1 mb-10">
        {/* Left */}
        <div className="relative bg-white border pb-10">
          <img
            src={machine3}
            alt="Machine"
            className="object-contain w-full h-full"
          />
        </div>
        {/* Right */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6 leading-tight">
            Final Quality Checks
          </h1>
          <p className="text-md text-gray-700 mb-6 leading-relaxed">
            Each product undergoes rigorous testing to meet our high-quality
            standards before reaching you. Our commitment is to excellence in
            every frame.
          </p>
        </div>
      </div>

      {/* Slide 4*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-xl border-1">
        {/* Left (Text) */}
        <div className="bg-white p-10 flex flex-col justify-center order-2 md:order-1">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6 leading-tight">
            Seamless Fabrication
          </h1>
          <p className="text-md text-gray-700 mb-6 leading-relaxed">
            Our automated systems ensure every frame is fabricated with
            consistent strength and style. The process is fast, reliable, and
            fully scalable.
          </p>
        </div>

        {/* Right (Image) */}
        <div className="relative order-1 md:order-2 border">
          <img
            src={machine1}
            alt="Machine"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Slide 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-xl border-1 mb-10">
        {/* Left */}
        <div className="relative bg-white border pb-10">
          <img
            src={machine5}
            alt="Machine"
            className="object-contain w-full h-full"
          />
        </div>
        {/* Right */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6 leading-tight">
            Final Quality Checks
          </h1>
          <p className="text-md text-gray-700 mb-6 leading-relaxed">
            Each product undergoes rigorous testing to meet our high-quality
            standards before reaching you. Our commitment is to excellence in
            every frame.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
