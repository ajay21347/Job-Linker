import api from "@/utils/api";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your email...");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.get(`/user/verify-email/${token}`);

        setSuccess(true);
        setMessage(res.data.message || "Email verified successfully");
      } catch (error) {
        setSuccess(false);
        setMessage(error?.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (!success) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [success, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-100 to-pink-50 flex items-center justify-center p-6">
      {/* Background Glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/50 p-10 max-w-md w-full text-center animate-card-enter">
        {/* LOADING */}
        {loading ? (
          <>
            <Loader2 className="w-16 h-16 text-purple-600 mx-auto animate-spin" />

            <h2 className="text-2xl font-bold text-gray-800 mt-6">
              Verifying Email
            </h2>

            <p className="text-gray-500 mt-3 animate-pulse">{message}</p>
          </>
        ) : success ? (
          <>
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">JP</span>
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Job Portal
              </h1>
            </div>

            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="success-ring">
                <CheckCircle className="w-16 h-16 text-green-600 animate-tick" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Email Verified 🎉
            </h2>

            <p className="text-gray-500 mt-4 leading-7">{message}</p>

            <p className="text-gray-500 mt-2">
              Your account is ready. You can now login and start applying for
              jobs.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Continue to Login
            </button>

            <p className="text-sm text-gray-400 mt-4">
              Redirecting in {countdown}s...
            </p>
          </>
        ) : (
          <>
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">JP</span>
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Job Portal
              </h1>
            </div>

            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6 animate-bounce" />

            <h2 className="text-3xl font-bold text-gray-800">
              Verification Failed
            </h2>

            <p className="text-gray-500 mt-4">{message}</p>

            <p className="text-gray-400 mt-2">
              The verification link may be invalid or expired.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Back To Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
