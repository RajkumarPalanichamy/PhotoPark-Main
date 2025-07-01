import React from "react";
import LandingPage from "../Components/HomePageComponents/LandingPage";
import NewArrivals from "../Components/HomePageComponents/NewArrivals";
import Acrylicintro from "../Components/HomePageComponents/Acrylicintro"
import Canvasintro from "../Components/HomePageComponents/Canvasintro";
import Backlightintro from "../Components/HomePageComponents/Backlightintro";
import Offers from "../Components/HomePageComponents/Offers";
import Customize from "../Components/HomePageComponents/Customize";
import Faq from "../Components/HomePageComponents/Faq";
import ShippingDetails from "../Components/HomePageComponents/ShippingDetails";


const Home = () => {
  return (
    <div>
      <LandingPage />
      <NewArrivals />
      <Offers/>
      <Customize/>
      <Acrylicintro />
      <Canvasintro/>
      <Backlightintro/>
      <Faq/>
      <ShippingDetails/>
    </div>
  );
};

export default Home;
