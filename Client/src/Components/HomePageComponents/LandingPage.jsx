import React from "react";
import { motion} from "framer-motion";
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

      {/*---------------- Landing Page-------------------- */}

      <div className="relative w-full h-170 overflow-hidden">
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

        {/* Landing Page Content Box */}

        <div className="absolute z-0 opacity-75 text-white bg-black border border-1 border-white top-50 w-80 left-8 p-5 w-100 p-10 left-20 top-55 ">
          <Link to="/Offers">
            <div
              style={{ fontSize: "44px", fontWeight: "bold", color: "white" }}
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
  );
}
