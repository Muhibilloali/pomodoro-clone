import React, { useState } from "react";
import Photologo from "../Images/brandlogo-white.png";
import { Link } from "react-router-dom";
import "./Forgot.css";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

function Forgot() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    fetch("https://djangoapibekmurod.pythonanywhere.com/auth/jwt/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        console.log("Login successful:", data);
        window.location.href = "/daily";
        // You can handle success here
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // You can handle errors here
      });
  };

  return (
    <div className="flex justify-center items-center pb-12 h-screen">
      <div className="w-full sm:w-96">
        <a href="/" className="flex justify-center items-center  mb-0">
          <img src={Photologo} className="font-thin w-56 sm:w-96" alt="Logo" />
        </a>
        <div className="create-account">Reset Password</div>
        <div className="form-forgot">
          <Card color="transparent" shadow={false}>
            <form onSubmit={handleSubmit} className="p-12 text-justify">
              <div className="mb-1 mt-4 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-6">
                  Email
                </Typography>
                <Input
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  name="email"
                  placeholder="email@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="mt-8 font-normal" fullWidth>
                Reset Password
              </Button>
            </form>
            <div className="text-center items-center justify-center text-white mt-2">
              Try other methods? <Link to="/">Log in</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
