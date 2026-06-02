import api from "@/utils/api";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!data.password || !data.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await api.put(`/user/reset-password/${token}`, {
        password: data.password,
      });

      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-100 to-pink-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
            <Lock className="text-white w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>

          <p className="text-gray-500 mt-2">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm">New Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) =>
                  setData({
                    ...data,
                    password: e.target.value,
                  })
                }
                className="w-full h-12 border rounded-xl px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">Confirm Password</label>

            <input
              type={showPassword ? "text" : "password"}
              value={data.confirmPassword}
              onChange={(e) =>
                setData({
                  ...data,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full h-12 border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="mx-auto w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full text-sm text-purple-600 hover:underline"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
