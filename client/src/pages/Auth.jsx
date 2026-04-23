import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/v1/user/login"
      : "http://localhost:5000/api/v1/user/register";

    try {
      const res = await axios.post(url, data);
      console.log(res.data);
      alert(isLogin ? "Login Successful" : "Regsitered Successfully");

      if (isLogin) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role;

        if (role === "admin") {
          window.location.href = "/admin-dashboard";
        } else if (role === "recruiter") {
          window.location.href = "/recruiter-dashboard";
        } else {
          window.location.href = "/seeker-dashboard";
        }
      }
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center px-10 md:px-20 bg-white">
        <h1
          className="text-3xl font-semibold mb-10 text-purple-700
        "
        >
          Job Portal
        </h1>
        <h2 className="text-4xl font-bold mb-2">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-gray-500 mb-8">
          {isLogin ? "Please enter your details" : "Start your journey"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          {!isLogin && (
            <div>
              <label className="block mb-2 text-sm">Name</label>
              <Input
                type="text"
                className="h-12"
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm">Email Address</label>{" "}
            <Input
              type="email"
              className="h-12"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">Password</label>{" "}
            <Input
              type="password"
              className="h-12"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          {isLogin && (
            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>
              <span className="text-purple-600 cursor-pointer">
                Forgot Password
              </span>
            </div>
          )}

          <Button
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105 active:scale-95
          "
          >
            {isLogin ? "Sign in" : "Sign up"}
          </Button>
          <p className="text-sm text-center text-gray-500">
            {isLogin ? "Don't have an account?" : "Already hav ana account?"}{" "}
            <span
              className="text-purple-600 cursor-pointer font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </form>
      </div>
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500">
        <img
          src="https://illustrations.popsy.co/purple/web-design.svg"
          alt="illustration"
          className="w-[80%]"
        />
      </div>
    </div>
  );
};

export default Auth;
