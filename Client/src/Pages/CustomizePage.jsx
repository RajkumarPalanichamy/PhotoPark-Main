import React from 'react'
import AcryliCustomize from "../Components/HomePageComponents/Acrylicintro"
import CanvasCustomize from "../Components/HomePageComponents/Canvasintro"
import BacklightCustomize from "../Components/HomePageComponents/Backlightintro"

const CustomizePage = () => {

  return (
    <div>
      <div>
        <AcryliCustomize />
        <CanvasCustomize/>
        <BacklightCustomize/>
      </div>
    </div>
  );

}

export default CustomizePage