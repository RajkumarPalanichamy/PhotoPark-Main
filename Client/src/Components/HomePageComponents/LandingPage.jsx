import React from "react";
import { motion } from "framer-motion";
import parkvideo from "../../assets/frontend_assets/HomeSlides/photoparkk Video.mp4";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      {/* OFFERS SCROLLING */}
      <div
        style={{
          height: "40px",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
        className="z-0"
      >
        <motion.div
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        >
          50% Product Sales going on here! Check it and Buy Soon &nbsp; &bull;
          &nbsp; 50% Product Sales going on here!
        </motion.div>
      </div>

      {/* ---------------- Landing Page ---------------- */}
      <div className="relative w-full">
        {/* ✅ Mobile: video with 16:9 aspect ratio */}
        <div className="block sm:hidden pt-[56.25%] relative w-full">
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

          {/* ✅ Mobile: small content box at top-left */}
          <div className="absolute top-20 left-2 z-10 bg-black bg-opacity-75 border border-white p-3 w-[40%]">
            <Link to="/Offers">
              <div className="text-sm font-bold text-white leading-snug">
                SPECIAL{" "}
                <span className="bg-red-600 px-1 py-[2px] rounded">50%</span>{" "}
                OFFERS COLLECTIONS
              </div>
              <button className="mt-3 bg-white text-black text-xs px-2 py-1 rounded">
                PURCHASE HERE
              </button>
            </Link>
          </div>
        </div>

        {/* ✅ Desktop: original layout preserved */}
        <div className="hidden sm:block relative w-full h-[600px] overflow-hidden">
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

          {/* Original Desktop Content Box (unchanged) */}
          <div className="absolute z-10 opacity-75 text-white bg-black border border-white top-50 w-80 left-8 p-5 w-100 p-10 left-20 top-55">
            <Link to="/Offers">
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                SPECIAL{" "}
                <span style={{ backgroundColor: "red", padding: "5px" }}>
                  50%
                </span>{" "}
                OFFERS COLLECTIONS
              </div>

              <button
                style={{
                  marginTop: "10px",
                  fontSize: "18px",
                  backgroundColor: "white",
                  color: "black",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                PURCHASE HERE
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
