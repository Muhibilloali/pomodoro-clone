import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { LuBadgeCheck } from "react-icons/lu";

function SigninSuccess() {
  return (

    <div className="flex flex-col items-center justify-center h-screen text-white text-center p-4">
      
      <div className="flex items-center justify-center rounded-full text-9xl w-52 h-52 mb-6">
        <LuBadgeCheck />
      </div>
      <h1 className="text-4xl font-900 mb-4">Activation link has been sent</h1>
      <p className="max-w-md text-xl font-700 mb-4">
        Activation link has been sent to your email address. To start using Pomofocus, please activate your account from the link.
      </p>
      
      
    </div>
  );
}


export default SigninSuccess