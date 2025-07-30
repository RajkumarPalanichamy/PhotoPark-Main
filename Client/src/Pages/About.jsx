import React from "react";
import machine1 from "../assets/frontend_assets/About/machine1.jpg";
import machine2 from "../assets/frontend_assets/About/machine2.jpg";
import machine3 from "../assets/frontend_assets/About/machine3.jpg";
import machine4 from "../assets/frontend_assets/About/machine4.jpg";
import machine5 from "../assets/frontend_assets/About/machine5.jpg";
import AboutVideo from "../assets/frontend_assets/HomeSlides/photoparkk Video.mp4";

const About = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 font-[poppins]">
      {/* Video Section */}
      <div className="relative w-full h-[600px] border-1 border-gray-600 rounded-3xl overflow-hidden shadow-2xl mt-8">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={AboutVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Text */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center  text-white text-center px-4">

         <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-10 shadow-lg">
  <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md text-white">
    Advanced Machinery In Action
  </h1>
  <p className="max-w-2xl text-lg md:text-xl font-medium drop-shadow-md text-white">
    Witness our state-of-the-art production process delivering precision-crafted frames with unmatched quality.
  </p>
</div>

        
        </div>
      </div>

      {/* Slide 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 overflow-hidden rounded-3xl shadow-xl border border-gray-200">
        <div className="relative bg-white">
          <img src={machine2} alt="Machine" className="object-contain w-full h-full" />
        </div>
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6">
            Precision Engineering
          </h1>
          <p className="text-md text-gray-700 leading-relaxed">
            We use cutting-edge technology to ensure accuracy and quality in every frame. From concept to creation, our machines handle it all with unmatched precision.
          </p>
        </div>
      </div>

      {/* Slide 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 overflow-hidden rounded-3xl shadow-xl border border-gray-200">
        <div className="bg-white p-10 flex flex-col justify-center order-2 md:order-1">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6">
            Seamless Fabrication
          </h1>
          <p className="text-md text-gray-700 leading-relaxed">
            Our automated systems ensure every frame is fabricated with consistent strength and style. The process is fast, reliable, and fully scalable.
          </p>
        </div>
        <div className="relative order-1 md:order-2 bg-white">
          <img src={machine4} alt="Machine" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Slide 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 overflow-hidden rounded-3xl shadow-xl border border-gray-200">
        <div className="relative bg-white">
          <img src={machine3} alt="Machine" className="object-contain w-full h-full" />
        </div>
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6">
            Final Quality Checks
          </h1>
          <p className="text-md text-gray-700 leading-relaxed">
            Each product undergoes rigorous testing to meet our high-quality standards before reaching you. Our commitment is to excellence in every frame.
          </p>
        </div>
      </div>

      {/* Slide 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 overflow-hidden rounded-3xl shadow-xl border border-gray-200">
        <div className="bg-white p-10 flex flex-col justify-center order-2 md:order-1">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6">
            Seamless Fabrication
          </h1>
          <p className="text-md text-gray-700 leading-relaxed">
            Our automated systems ensure every frame is fabricated with consistent strength and style. The process is fast, reliable, and fully scalable.
          </p>
        </div>
        <div className="relative order-1 md:order-2 bg-white">
          <img src={machine1} alt="Machine" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Slide 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-16 overflow-hidden rounded-3xl shadow-xl border border-gray-200 mb-20">
        <div className="relative bg-white">
          <img src={machine5} alt="Machine" className="object-contain w-full h-full" />
        </div>
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-6">
            Final Quality Checks
          </h1>
          <p className="text-md text-gray-700 leading-relaxed">
            Each product undergoes rigorous testing to meet our high-quality standards before reaching you. Our commitment is to excellence in every frame.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
