import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Photologo from "../Images/brandlogo-white.png";
import Photogoogle from "../Images/g-logo.png";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import "./Signin.css";

function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGoogleAPI = () => {
      window.gapi.load("auth2", () => {
        window.gapi.auth2.init({
          client_id:
            "1048955366256-ghhh4fbnssumuuu5ro4udn7suqdk8p06.apps.googleusercontent.com",
        });
      });
    };
    loadGoogleAPI();
  }, []);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

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
        console.log("Access token:", data.access);
        localStorage.setItem("accessToken", data.access);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setError("Incorrect email or password.");
      });
  };

  const handleGoogleLogin = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.grantOfflineAccess().then((response) => {
      const code = response.code;

      fetch(
        "https://djangoapibekmurod.pythonanywhere.com/auth/o/google-oauth2/?redirect_uri=http://localhost:5173",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Google login successful:", data);
          localStorage.setItem("accessToken", data.access_token);
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Google login failed:", error);
          setError("Google login failed.");
        });
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full h-auto sm:w-96">
        <a href="/" className="flex justify-center items-center mt-32 mb-0">
          <img src={Photologo} className="font-thin w-56 sm:w-96" alt="Logo" />
        </a>
        <div className="create-account">Login</div>
        <div className="form-signin">
          <Card color="transparent" shadow={false}>
            <form onSubmit={handleSubmit} className="p-12 text-justify">
              <Button
                type="button"
                className="flex bg-white text-center items-center font-bold justify-center text-inherit"
                onClick={handleGoogleLogin}
              >
                <img src={Photogoogle} className="w-7" alt="Google Logo" />{" "}
                Login with Google
              </Button>
              <div className="flex mt-3">
                <hr className="w-5/12 mt-4 pr-4" />{" "}
                <span className="pr-4 pl-4">or</span>{" "}
                <hr className="w-6/12 mt-4 pr-3" />{" "}
              </div>
              {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )}
              <div className="mb-1 mt-4 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-6">
                  Email
                </Typography>
                <Input
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  name="email"
                  placeholder="email@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Typography variant="h6" color="blue-gray" className="-mb-6">
                  Password
                </Typography>
                <Input
                  type="password"
                  size="lg"
                  placeholder="********"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="mt-8 font-normal" fullWidth>
                Login with Email
              </Button>
              <div>
                <button className="text-center items-center justify-center text-inherit mt-2">
                  <Link to="/forgot"> Forgot Password</Link>
                </button>
              </div>
            </form>
            <div className="text-center items-center justify-center text-white mt-2">
              Do not have an account? <Link to="/signup"> Create account</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Signin;
