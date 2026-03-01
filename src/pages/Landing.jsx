import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔥 Auto Redirect if Logged In
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="bg-white text-gray-800">
      
      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-8 py-5 shadow-sm">
        <h1 className="text-2xl font-bold">
          Ad<span className="text-indigo-600">GenAI</span>
        </h1>

        <div className="space-x-6 hidden md:flex items-center">
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#pricing" className="hover:text-indigo-600">Pricing</a>

          {!token ? (
            <>
              <Link to="/login" className="hover:text-indigo-600">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="text-center py-24 px-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
          Generate High-Converting Ads <br />
          in Seconds with <span className="text-indigo-600">AI</span>
        </h2>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Create Facebook, Google & Instagram ads instantly. Save time, boost
          conversions, and scale your marketing effortlessly.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          {!token ? (
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              🚀 Start Free
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              Go to Dashboard →
            </Link>
          )}

          <a
            href="#features"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* ================= PROBLEM SECTION ================= */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-6">
          Creating ads is expensive & time-consuming
        </h3>
        <p className="text-gray-600 text-lg">
          Hiring agencies costs thousands. Writing high-converting copy takes
          hours. Testing multiple variations is exhausting.
        </p>
        <p className="mt-4 text-indigo-600 font-semibold text-lg">
          AdGenAI solves this in seconds.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">Powerful Features</h3>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: "⚡ Instant Generation",
                desc: "Generate multiple ad variations in seconds.",
              },
              {
                title: "🎯 Audience Targeting",
                desc: "Customize tone and audience for better conversions.",
              },
              {
                title: "📊 Analytics Dashboard",
                desc: "Track your ad performance and usage.",
              },
              {
                title: "💾 Save & Manage Ads",
                desc: "Store, edit, and reuse your ad copies anytime.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all"
              >
                <h4 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="py-20 bg-gray-50 px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">Simple Pricing</h3>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
            <h4 className="text-2xl font-semibold mb-4">Free</h4>
            <p className="text-4xl font-bold mb-4">₹0</p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>✔ 10 Ads per month</li>
              <li>✔ Basic analytics</li>
              <li>✔ Ad history</li>
            </ul>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-xl hover:scale-105 transition">
            <h4 className="text-2xl font-semibold mb-4">Pro</h4>
            <p className="text-4xl font-bold mb-4">₹499/month</p>
            <ul className="space-y-2 mb-6">
              <li>✔ 500 Ads per month</li>
              <li>✔ Advanced analytics</li>
              <li>✔ Priority support</li>
            </ul>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
              Upgrade Now
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AdGenAI. All rights reserved.
      </footer>
    </div>
  );
}