import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Lock, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // 👈 This grabs ?token=xyz from the URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axiosInstance.post("/auth/reset-password", { token, newPassword });
      setMessage("Password updated! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage("Invalid or expired link. Please request a new one.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-white">
        <h2 className="text-3xl font-black mb-2 italic">New Start.</h2>
        <p className="text-gray-400 mb-8 text-sm">Set a strong new password for your account.</p>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-500" size={20} />
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-500" size={20} />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold transition shadow-lg shadow-emerald-500/20">
            Update Password
          </button>
        </form>

        {message && (
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 font-bold animate-pulse">
            <CheckCircle size={18} /> {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;