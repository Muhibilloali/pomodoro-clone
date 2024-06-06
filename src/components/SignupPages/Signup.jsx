import React, { useState } from "react";
import { Link, useNavigate,  } from "react-router-dom";
import Photologo from "../Images/brandlogo-white.png";
import Photogoogle from "../Images/g-logo.png";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import "./signup.css";

function Signup() {
  const navigate = useNavigate();
  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const [generated, setGenerated] = useState(generateRandomString(16));

  const [formData, setFormData] = useState({
    first_name: "User",
    email: "",
    password: generated,
    re_password: generated,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await fetch(
        "https://djangoapibekmurod.pythonanywhere.com/auth/users/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const { email } = await response.json();
        console.log(email);
        const chainedResp = await fetch(
          "https://djangoapibekmurod.pythonanywhere.com/auth/users/reset_password/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          }
        );
        

        
        if(chainedResp.ok) navigate("/signinsuccess") 

        // return response.json();
      }
    } 
    catch (err) {
      throw new Error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full sm:w-96">
        <a href="/" className="flex justify-center items-center mt-32 mb-0">
          <img src={Photologo} className="font-thin w-56 sm:w-96" alt="Logo" />
        </a>
        <div className="create-account">Create Account</div>
        <div className="form-signup">
          <Card color="transparent" shadow={false}>
            <form onSubmit={handleSubmit} className="p-12 text-justify">
              <Button
                type="submit"
                className="flex bg-white text-center items-center font-bold justify-center text-inherit"
              >
                <img src={Photogoogle} className="w-7" alt="Google Logo" />{" "}
                Signup with Google
              </Button>
              <div className="flex mt-3">
                <hr className="w-5/12 mt-4 pr-4" />{" "}
                <span className="pr-4 pl-4">or</span>{" "}
                <hr className="w-6/12 mt-4 pr-3" />{" "}
              </div>

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
              </div>
              <Button type="submit" className="mt-8 font-normal" fullWidth>
                Sign up with Email
              </Button>
            </form>
            <div className="text-center items-center justify-center text-white mt-2">
              Already have an account? <Link to="/signin"> Log in </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Signup;
