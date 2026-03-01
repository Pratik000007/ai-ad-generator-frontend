import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Typewriter from "../components/Typewriter";

function CreateAd() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult([]);

    try {
      const response = await axiosInstance.post("/ads/generate", {
        product,
        audience,
        tone,
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate ad");
    }

    setLoading(false);
  };

  const handleShare = (platform, ad) => {
    const text = `${ad.headline}\n\n${ad.description}\n\n${ad.cta}`;
    const encodedText = encodeURIComponent(text);

    let url = "";

    switch (platform) {
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedText}`;
        break;

      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;

      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedText}`;
        break;

      case "whatsapp":
        url = `https://wa.me/?text=${encodedText}`;
        break;

      default:
        return;
    }

    window.open(url, "_blank");
  };

  const handleCopy = (ad, index) => {
    const text = `
Headline: ${ad.headline}

Description: ${ad.description}

CTA: ${ad.cta}
    `;

    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl text-white">

        <h2 className="text-4xl font-bold mb-2 text-center">
          🚀 Generate High-Converting Ads
        </h2>
        <p className="text-center text-gray-300 mb-8">
          Let AI craft powerful ads for your product in seconds.
        </p>

        {/* FORM */}
        <form onSubmit={handleGenerate} className="space-y-6">

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. AI Resume Builder"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full bg-white/20 border border-white/30 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-300"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Target Audience
            </label>
            <input
              type="text"
              placeholder="e.g. College students"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-white/20 border border-white/30 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-300"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-white/20 border border-white/30 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white"
              required
            >
              <option value="">Select Tone</option>
              <option value="Professional">Professional</option>
              <option value="Casual">Casual</option>
              <option value="Funny">Funny</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {loading ? "Generating Magic..." : "✨ Generate Ad"}
          </button>

        </form>

        {/* RESULTS */}
        {result.length > 0 && (
          <div className="mt-12 space-y-6">
            <h3 className="text-2xl font-bold mb-4 text-center">
              🎯 Generated Ads
            </h3>

            {result.map((ad, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-xl"
              >

                
                {ad.imageUrl && (
                  <div className="relative group">
                <img
              src={ad.imageUrl}
                        alt="AI Generated Ad"
      // Added a 'bg-gray-800' and 'min-h-[250px]' so the card doesn't jump while loading
              className="w-full min-h-[250px] bg-gray-800 object-cover rounded-xl mb-4 border border-white/10 shadow-inner"
             loading="lazy"
            onError={(e) => {
        // If the AI URL fails, show a nice placeholder
           e.target.src = "https://via.placeholder.com/1024x1024?text=Generating+Ad+Visual...";
          }}
       />
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
       <button 
         onClick={() => window.open(ad.imageUrl, "_blank")}
         className="bg-black/60 backdrop-blur-md p-2 rounded-full text-xs"
       >
         👁️ View Full
       </button>
    </div>
  </div>
)}



                <h4 className="text-xl font-bold mb-3 text-indigo-300">
                  <Typewriter text={ad.headline} speed={15} />
                </h4>

                <p className="text-gray-200 mb-3 leading-relaxed">
                  <Typewriter text={ad.description} speed={10} />
                </p>

                <p className="text-sm text-indigo-200 font-medium mb-5">
                  <Typewriter text={ad.cta} speed={20} />
                </p>

                {/* Buttons Section */}
                <div className="flex flex-wrap gap-4 items-center">

                  <button
                    onClick={() => handleCopy(ad, index)}
                    className="px-5 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
                  >
                    {copiedIndex === index ? "✅ Copied!" : "📋 Copy Ad"}
                  </button>

                  <button
                    onClick={() => handleShare("linkedin", ad)}
                    className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:scale-105 transition"
                  >
                    LinkedIn
                  </button>

                  <button
                    onClick={() => handleShare("twitter", ad)}
                    className="px-4 py-2 bg-black rounded-lg text-sm hover:scale-105 transition"
                  >
                    Twitter
                  </button>

                  <button
                    onClick={() => handleShare("facebook", ad)}
                    className="px-4 py-2 bg-blue-800 rounded-lg text-sm hover:scale-105 transition"
                  >
                    Facebook
                  </button>

                  <button
                    onClick={() => handleShare("whatsapp", ad)}
                    className="px-4 py-2 bg-green-600 rounded-lg text-sm hover:scale-105 transition"
                  >
                    WhatsApp
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default CreateAd;