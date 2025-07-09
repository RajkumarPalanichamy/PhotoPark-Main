import React, { useState, useEffect } from "react";
import { FiTag, FiShoppingCart } from "react-icons/fi";
import topOffer1 from "../../assets/Offers/Topoffer1.jpeg";
import topOffer2 from "../../assets/Offers/Topoffer2.jpeg";
import downOffer1 from "../../assets/Offers/Downoffer1.jpeg";
import downOffer2 from "../../assets/Offers/Downoffer2.jpeg";
import { Link } from "react-router-dom";

const topOffers = [topOffer1, topOffer2];
const downOffers = [downOffer1, downOffer2];

const Offers = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % topOffers.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-4 mx-4 sm:mx-[5vw] my-10 font-[Poppins]">
      <h1 className="text-5xl font-extrabold mb-4 text-center">
        Stunning Acrylic & Photo Frames
        <br />
        <span className="text-3xl font-bold text-orange-400 animate-pulse">
          Special Offers Just for You!
        </span>
      </h1>

      <p className="text-lg text-gray-700 text-center mb-10 max-w-2xl mx-auto">
        Transform your cherished moments into timeless decor with our
        <span className="font-semibold text-blue-900">
          {" "}
          premium acrylic and wooden frames.{" "}
        </span>
        Limited-time discounts on handcrafted, high-quality designs!
      </p>

      <Link to="/specialoffers">
        <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto w-full  border-black-900 shadow-2xl">
          {/* Top Offer Image */}
          <div className="relative group order-1">
            <img
              src={topOffers[index]}
              alt="Top Offer"
              loading="lazy"
              className="w-full h-56 sm:h-72 md:h-80 xl:h-[32rem] 2xl:h-[32rem] object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
              <button className="bg-white text-black px-4 py-2 font-semibold shadow-lg">
                BUY NOW
              </button>
            </div>
          </div>

          {/* Flat 50% Offer Text with Discount Label */}
          <div className="flex flex-col justify-center items-center bg-gray-100 text-xl font-bold p-6 rounded-lg shadow-lg order-2 xl:h-[32rem] 2xl:h-[32rem] space-y-4 relative">
            {/* Discount Label */}
            <div className="absolute top-6 -right-8 rotate-45 bg-red-600 text-white px-6 py-1 text-xs sm:text-sm font-bold shadow-lg rounded-tl-3xl rounded-tr-4xl hidden sm:block">
              FLAT 50% OFF
            </div>

            <p className="flex items-center gap-2 text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-green-700">
              <FiTag className="text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl text-red-600 drop-shadow-sm" />
              <span className="text-black">Exclusive Limited Offer</span>
            </p>

            <p className="text-2xl sm:text-4xl xl:text-5xl 2xl:text-6xl text-yellow-500 font-extrabold mt-2 text-center">
              Flat 50% OFF
            </p>

            <p className="text-xs sm:text-sm xl:text-base 2xl:text-lg text-gray-600 mt-2 text-center">
              Hurry! Offer ends soon.
            </p>

            <button className="mt-4 bg-orange-400 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-orange-500 transition-all flex items-center gap-2 text-sm sm:text-base xl:text-lg 2xl:text-xl">
              <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
              Grab the Deal
            </button>
          </div>

          {/* Bottom Offer Image */}
          <div className="relative group order-3 sm:order-4">
            <img
              src={downOffers[index]}
              alt="Down Offer"
              loading="lazy"
              className="w-full h-56 sm:h-72 md:h-80 xl:h-[32rem] 2xl:h-[32rem] object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
              <button className="bg-white text-black px-4 py-2 font-semibold shadow-lg hover:bg-gray-200">
                BUY NOW
              </button>
            </div>
          </div>

          {/* Buy 1 Get 1 Free Text */}
          <div className="flex flex-col justify-center items-center bg-gray-100 text-xl font-bold p-6 rounded-lg shadow-lg order-4 sm:order-3 xl:h-[32rem] 2xl:h-[32rem] space-y-4">
            <p className="flex items-center gap-2 text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-green-700">
              <FiTag className="text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl text-green-800 drop-shadow-sm" />
              <span className="text-black">Unbeatable Best Deal</span>
            </p>

            <p className="text-2xl sm:text-4xl xl:text-5xl 2xl:text-6xl text-yellow-500 font-extrabold text-center mt-2">
              Buy 1 Get 1 Free
            </p>

            <p className="text-xs sm:text-sm xl:text-base 2xl:text-lg text-gray-600 mt-2 text-center">
              Double the joy for the same price!
            </p>
            <button className="mt-4 bg-orange-400 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-orange-500 transition-all flex items-center gap-2 text-sm sm:text-base xl:text-lg 2xl:text-xl">
              <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
              Shop Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Offers;
