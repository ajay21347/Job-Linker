import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/utils/api";
import axios from "axios";
import { Briefcase, Eye, EyeOff, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
  });

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await api.post("/user/forgot-password", {
        email: forgotEmail,
      });

      toast.success("Password reset link sent. Please check your email.");

      setTimeout(() => {
        setMode("login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Login Validation
    if (mode === "login") {
      if (!data.email.trim() || !data.password.trim()) {
        toast.error("Please fill all fields");
        return;
      }
    }

    //Register Validation
    if (mode === "signup") {
      if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
        toast.error("Please fill all fields");
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (mode === "signup" && data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const url =
      mode === "login"
        ? "http://localhost:5000/api/v1/user/login"
        : "http://localhost:5000/api/v1/user/register";

    const loadingToast = toast.loading(
      mode === "login" ? "Signing in..." : "Creating account...",
    );

    try {
      setLoading(true);
      const res = await axios.post(url, data);

      if (mode === "signup") {
        toast.success("Registered Successfully! Please login", {
          id: loadingToast,
        });

        setTimeout(() => {
          setMode(true);
        }, 1500);
        return;
      }

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const firstName = res.data.user.name.split(" ")[0];
      toast.success(`Welcome back, ${firstName}`, {
        id: loadingToast,
      });

      const role = res.data.user.role;

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/seeker-dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
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
          {mode === "login"
            ? "Welcome back"
            : mode === "signup"
              ? "Create account"
              : "Forgot Password"}
        </h2>

        <p className="text-gray-500 mb-8">
          {mode === "login"
            ? "Please enter your details"
            : mode === "signup"
              ? "Start your journey"
              : "Enter your email to receive a reset link"}
        </p>

        <form
          onSubmit={
            mode !== "forgot" ? handleSubmit : (e) => e.preventDefault()
          }
          className="space-y-6"
        >
          {/* FORGOT PASSWORD */}
          {mode === "forgot" ? (
            <>
              <div>
                <label className="block mb-2 text-sm">Email Address</label>

                <Input
                  type="email"
                  className="h-12"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <Button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full h-12 text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Remember your password?{" "}
                <span
                  onClick={() => setMode("login")}
                  className="text-purple-600 cursor-pointer font-medium hover:underline"
                >
                  Back to Login
                </span>
              </p>
            </>
          ) : (
            <>
              {/* Name */}
              {mode === "signup" && (
                <div>
                  <label className="block mb-2 text-sm">Name</label>

                  <Input
                    type="text"
                    className="h-12"
                    onChange={(e) =>
                      setData({
                        ...data,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm">Email Address</label>

                <Input
                  type="email"
                  className="h-12"
                  onChange={(e) =>
                    setData({
                      ...data,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm">Password</label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="h-12 pr-12 focus:ring-2 focus:ring-purple-400"
                    onChange={(e) =>
                      setData({
                        ...data,
                        password: e.target.value,
                      })
                    }
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

              {/* Forgot Password */}
              {mode === "login" && (
                <div className="flex justify-end text-sm">
                  <span
                    onClick={() => setMode("forgot")}
                    className="text-purple-600 cursor-pointer hover:underline"
                  >
                    Forgot Password?
                  </span>
                </div>
              )}

              {/* Role Selection */}
              {mode === "signup" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Select Role</label>

                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        data.role === "seeker" ? "scale-110" : "text-gray-500"
                      }`}
                    >
                      <User className="w-5 h-5" />

                      <span className="text-sm font-medium">Seeker</span>
                    </div>

                    <div
                      onClick={() =>
                        setData({
                          ...data,
                          role:
                            data.role === "recruiter" ? "seeker" : "recruiter",
                        })
                      }
                      className={`w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                        data.role === "recruiter"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-500"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600"
                      }`}
                    >
                      <div
                        className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-all duration-300 ${
                          data.role === "recruiter"
                            ? "translate-x-10"
                            : "translate-x-0"
                        }`}
                      />
                    </div>

                    <div
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        data.role === "recruiter"
                          ? "scale-110"
                          : "text-gray-500"
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />

                      <span className="text-sm font-medium">Recruiter</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                disabled={loading}
                className="w-full h-12 text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>

              <p className="text-sm text-center text-gray-500">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <span
                  className="text-purple-600 cursor-pointer font-medium hover:underline"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login" ? "Sign Up" : "Login"}
                </span>
              </p>
            </>
          )}
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
