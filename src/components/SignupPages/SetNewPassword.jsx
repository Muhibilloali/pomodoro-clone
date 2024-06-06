import React, { useState } from "react";
import Photologo from "../Images/brandlogo-white.png";
import { useNavigate, useParams } from "react-router-dom";

function SetNewPassword() {
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });

  const { uid, token } = useParams();
  const nav = useNavigate()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      uid,
      token,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const resp = await fetch(
        "https://djangoapibekmurod.pythonanywhere.com/auth/users/reset_password_confirm/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (resp.ok) {
        return nav("/signin") ;
      }
    } catch (err) {
      throw new Error(err);
    }

    // Submit the new password to your backend here
    console.log("New password set:", formData.password);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white p-4">
      <img src={Photologo} alt="Logo" className="w-40 mb-4" />
      <h2 className="text-xl mb-6">Set New Password</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white   text-black p-8 rounded shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block  text-black text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="new_password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3  text-black leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="re_new_password"
            className="block text-black text-sm font-bold mb-2"
          >
            Password (Confirm)
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="re_new_password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Set Password
        </button>
      </form>
    </div>
  );
}

export default SetNewPassword;
