import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setMessage("✅ If an account exists, a reset link has been sent!");
    } catch (err) {
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-white">
        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <h2 className="text-3xl font-black mb-2 italic">Lost Access?</h2>
        <p className="text-gray-400 mb-8 text-sm">Enter your email and we'll send you a magic link to get back in.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-500" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-500/20"
          >
            {loading ? "Sending..." : <><Send size={18} /> Send Reset Link</>}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-xl text-center text-sm font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;