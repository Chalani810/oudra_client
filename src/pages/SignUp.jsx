import React from "react";
import SignUpForm from "../component/SignUp/SignUpForm";
import BackgroundImage from "../component/SignUp/image9.jpg"; // Import the background image

const SignUpPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start justify-start"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 m-8 rounded-2xl shadow-md max-w-lg w-full">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;

