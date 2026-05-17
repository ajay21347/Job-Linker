import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Briefcase, Eye, EyeOff, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/v1/user/login"
      : "http://localhost:5000/api/v1/user/register";

    try {
      const res = await axios.post(url, data);
      if (!isLogin) {
        toast.success("Registered Successfully");

        setTimeout(() => {
          setIsLogin(true);
        }, 1000);
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        const firstName = res.data.user.name.split(" ")[0];
        toast.success(`Welcome back, ${firstName}`);

        const role = res.data.user.role;

        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "recruiter") {
          navigate("/recruiter-dashboard");
        } else {
          navigate("/seeker-dashboard");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center px-10 md:px-20 bg-white">
        <h1
          className="text-3xl font-semibold mb-10 text-purple-700
        "
        >
          Job Linker
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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className="h-12 pr-12 focus:ring-2 focus:ring-purple-400"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5 hover:text-purple-600 transition-colors duration-200" />
                )}
              </button>
            </div>
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

          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Select Role</label>
              <div className="flex items-center gap-4">
                {/* Seeker */}
                <div
                  className={`flex items-center gap-2  text-bold transition-all duration-300 ${
                    data.role === "seeker" ? "scale-110 " : "text-gray-500"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium"> Seeker</span>
                </div>

                <div
                  onClick={() =>
                    setData({
                      ...data,
                      role: data.role === "recruiter" ? "seeker" : "recruiter",
                    })
                  }
                  className={`w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${data.role === "recruiter" ? "bg-gradient-to-r from-purple-600 to-indigo-500" : "bg-gradient-to-r from-indigo-500 to-purple-600"}`}
                >
                  <div
                    className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-all duration-300 ${data.role === "recruiter" ? "translate-x-10" : "translate-x-0"}`}
                  />
                </div>

                {/* Recruiter */}
                <div
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    data.role === "recruiter" ? "scale-110 " : "text-gray-500"
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  <span className="text-sm font-medium"> Recruiter</span>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105 active:scale-95
          "
          >
            {isLogin ? "Sign in" : "Sign up"}
          </Button>z

          <p className="text-sm text-center text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
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
