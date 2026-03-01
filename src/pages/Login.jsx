import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const Login = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const data = await login(email, password);

    //const role = response.role; // 👈 get role from response

    if (data.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    setError("Invalid email or password");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">

      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md text-white">

        <h1 className="text-3xl font-bold text-center mb-2">
          AI Ad Generator
        </h1>

        <p className="text-center text-white/80 mb-8">
          Create powerful AI ads in seconds
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}


<form onSubmit={handleSubmit} className="space-y-5">
  <div>
    <label className="block text-sm mb-1 text-white/80">Email</label>
    <input
      type="email"
      placeholder="you@example.com"
      className="w-full p-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white transition"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>

  <div>
    <label className="block text-sm mb-1 text-white/80">Password</label>
    <input
      type="password"
      placeholder="••••••••"
      className="w-full p-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white transition"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    
  
    <div className="flex justify-end mt-2">
      <Link 
        to="/forgot-password" 
        className="text-xs text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline"
      >
        Forgot Password?
      </Link>
    </div>
  </div>

  <button
    type="submit"
    className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
  >
    Sign In
  </button>
</form>


        <p className="text-center text-white/80 text-sm mt-6">
         Don’t have an account?{" "}
        <Link
           to="/register"
            className="font-semibold underline hover:text-white transition"
         >
            Sign Up
        </Link>
        </p>


          



        <p className="text-center text-white/70 text-sm mt-6">
          © 2026 AI Ad Generator
        </p>

      </div>
    </div>
  );
};

export default Login;
