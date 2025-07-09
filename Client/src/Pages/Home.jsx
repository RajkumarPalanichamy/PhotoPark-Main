import React from "react";
import LandingPage from "../Components/HomePageComponents/LandingPage";
import NewArrivals from "../Components/HomePageComponents/NewArrivals";
import Acrylicintro from "../Components/HomePageComponents/Acrylicintro";
import Canvasintro from "../Components/HomePageComponents/Canvasintro";
import Backlightintro from "../Components/HomePageComponents/Backlightintro";
import Offers from "../Components/HomePageComponents/Offers";
import Customize from "../Components/HomePageComponents/Customize";
import Faq from "../Components/HomePageComponents/Faq";
import ShippingDetails from "../Components/HomePageComponents/ShippingDetails";

const Home = () => {
  return (
    <div className="relative">
      <LandingPage />
      <NewArrivals />
      <Offers />
      <Customize />
      <Acrylicintro />
      <Canvasintro />
      <Backlightintro />
      <Faq />
      <ShippingDetails />

      {/* ✅ Floating WhatsApp Button - Responsive */}
      <a
        href="https://wa.me/919344175687" // 🔁 Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 group"
        title="Chat with us on WhatsApp"
      >
        <div className="flex items-center sm:gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-xl transition-transform duration-300 transform hover:scale-105 ring-2 ring-green-400">
          {/* WhatsApp Icon */}
          <div className="bg-white text-green-500 rounded-full p-2 shadow-md group-hover:rotate-12 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.004 2C6.486 2 2 6.486 2 12c0 2.084.802 3.979 2.121 5.428L2 22l4.677-2.068A9.953 9.953 0 0012.004 22c5.518 0 10.004-4.486 10.004-10S17.522 2 12.004 2zm0 18c-1.764 0-3.402-.578-4.741-1.553l-.336-.237-2.775 1.228.604-2.934-.215-.31C4.549 15.019 4 13.547 4 12c0-4.411 3.594-8 8.004-8 4.408 0 7.996 3.589 7.996 8s-3.588 8-7.996 8zm4.594-5.475c-.252-.126-1.484-.733-1.714-.818-.23-.084-.398-.126-.566.126-.168.252-.648.817-.794.985-.147.168-.293.189-.545.063-.252-.126-1.065-.392-2.028-1.25-.75-.668-1.257-1.491-1.404-1.743-.147-.252-.016-.388.11-.514.112-.112.252-.293.378-.44.126-.147.168-.252.252-.42.084-.168.042-.315-.021-.44-.063-.126-.566-1.37-.774-1.877-.204-.493-.412-.426-.566-.434-.147-.007-.315-.009-.483-.009s-.44.063-.671.315c-.231.252-.882.862-.882 2.102 0 1.241.903 2.441 1.028 2.609.126.168 1.77 2.705 4.29 3.79.6.258 1.067.411 1.43.525.6.191 1.147.164 1.578.1.481-.072 1.484-.605 1.693-1.189.209-.585.209-1.086.147-1.189-.063-.105-.231-.168-.483-.294z" />
            </svg>
          </div>

          {/* Text - visible on sm and up */}
          <span className="hidden sm:inline font-semibold text-sm tracking-wide">
            Call & Book Bulk Order
          </span>
        </div>
      </a>
    </div>
  );
};

export default Home;
