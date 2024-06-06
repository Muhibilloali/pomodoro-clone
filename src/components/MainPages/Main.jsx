import React from "react";
// import { IoSettingsOutline } from "react-icons/io5";
// import { FaUserCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Photologo from "../Images/brandlogo-white.png";
import "./Main.css";

function Main() {
  return (
    <div className="mainPages">
      <div className="flex  sm:w-96">
        <div className="header">
        <a href="/" className="pomodoro-logo">
        {/* flex mt-6 -ml-32 text-xs mb-0 */}
          <img
            src={Photologo}
            className="font-thin mr-10 text-xs w-auto h-12 sm:w-96"
            alt="Logo"
          />
        </a>
        <a href="/settings">
          <button
            type="submit"
            className="setting-button2"
            //flex ml-7 bg-red-200 tracking-widest  text-white rounded-md text-center items-center justify-center p-2  mt-8 font-normal
            fullWidth
          >
            {/* <IoSettingsOutline />  */}Settings
          </button>
        </a>
        <a href="/">
          <button
            type="submit"
            className="setting-button"
            fullWidth
          >
            {/* <FaUserCircle />  */} Sigin
          </button>
        </a>
        <a href="/modal">
          <button
            type="submit"
            className="setting-button3"
            fullWidth
          >
            <BsThreeDotsVertical />
          </button>
        </a>
        </div>
        
      </div>
      <div>
        <div className="timer-box">
          <div className="flex -ml-20 mt-20 w-56 sm:w-96">
            <button
              type="submit"
              className="flex ml-7 text-white rounded-md text-center items-center justify-center p-2  mt-2 font-normal"
              fullWidth
            >
              Pomodoro
            </button>
            <button
              type="submit"
              className="flex ml-7 w-auto bg-red-400 text-white rounded-md text-center items-center justify-center p-2  mt-2 font-normal"
              fullWidth
            >
              Short_Break
            </button>
            <button
              type="submit"
              className="flex ml-7  bg-red-400 text-white rounded-md text-center items-center justify-center p-2  mt-2 font-normal"
              fullWidth
            >
              Long_Break
            </button>
          </div>
          <div className="timer">
            25:00
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Main;
