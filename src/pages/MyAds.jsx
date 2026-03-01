import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const MyAds = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axiosInstance.get("/ads");
      setAds(res.data);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((ad) => ad.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Ad copied to clipboard!");
  };

  //const filteredAds = ads.filter((ad) =>
  //  ad.content.toLowerCase().includes(search.toLowerCase())
  //);

    const filteredAds = ads.filter((ad) => {
    const text = `
    ${ad.headline || ""}
    ${ad.description || ""}
    ${ad.cta || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading your ads...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-700 to-purple-700 text-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-12">AdGenAI</h2>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="block w-full text-left hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate("/create-ad")}
            className="block w-full text-left hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            ➕ Create Ad
          </button>

          <button
            onClick={() => navigate("/my-ads")}
            className="block w-full text-left bg-white/20 px-4 py-2 rounded-lg"
          >
            📄 My Ads
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="block w-full text-left hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Generated Ads
          </h1>

          <input
            type="text"
            placeholder="Search ads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Empty State */}
        {filteredAds.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <h2 className="text-xl font-semibold mb-4">
              No Ads Found 🚀
            </h2>
            <p className="text-gray-500 mb-6">
              Start generating ads to see them here.
            </p>
            <button
              onClick={() => navigate("/create-ad")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Generate Your First Ad
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition duration-300 hover:-translate-y-1"
              >
                <p className="text-gray-700 whitespace-pre-wrap mb-6 line-clamp-6">
                  {ad.content}
                </p>


                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {ad.headline}
                  </h3>

                  <p className="text-gray-600 mb-3">
                   {ad.description}
                  </p>

                  <p className="text-indigo-600 font-semibold mb-6">
                  {ad.cta}
                  </p>


                <div className="flex justify-between">
                  <button
                    onClick={() =>
                       handleCopy(
                      `${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}`
                      )
                    }
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => handleDelete(ad.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAds;