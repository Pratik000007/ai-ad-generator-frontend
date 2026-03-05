import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Files, 
  LogOut, 
  Zap, 
  Search,
  Copy,
  Trash2
} from "lucide-react";

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
    if (window.confirm("Are you sure you want to delete this ad?")) {
      try {
        await axiosInstance.delete(`/ads/${id}`);
        setAds((prev) => prev.filter((ad) => ad.id !== id));
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const handleCopy = (ad) => {
    const text = `${ad.headline}\n\n${ad.description}\n\n${ad.cta}`;
    navigator.clipboard.writeText(text);
    alert("Ad copied to clipboard!");
  };

  const filteredAds = ads.filter((ad) => {
    const text = `${ad.headline || ""} ${ad.description || ""} ${ad.cta || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600 font-bold">Loading your library...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* --- SIDEBAR (Matches Dashboard) --- */}
      <aside className="w-68 bg-indigo-900 text-white hidden lg:flex flex-col p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-indigo-500 p-2 rounded-lg shadow-lg">
            <Zap size={22} fill="white" />
          </div>
          <span className="text-xl font-black tracking-tight italic">ADGEN.AI</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => navigate("/dashboard")} />
          <SidebarItem icon={<PlusCircle size={20}/>} label="Create New Ad" onClick={() => navigate("/create-ad")} />
          <SidebarItem icon={<Files size={20}/>} label="My Library" active onClick={() => navigate("/my-ads")} />
        </nav>

        <div className="pt-6 border-t border-indigo-800">
           <SidebarItem icon={<LogOut size={20}/>} label="Sign Out" onClick={() => {
             localStorage.removeItem("token");
             navigate("/login");
           }} />
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Library</h1>
            <p className="text-slate-500 font-medium">Manage and export your generated ad content.</p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search your ads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </header>

        {filteredAds.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-sm text-center">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Files className="text-indigo-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No Ads Found</h2>
            <p className="text-slate-500 mb-8">Ready to create something amazing?</p>
            <button
              onClick={() => navigate("/create-ad")}
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Generate First Ad
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredAds.map((ad) => (
              <div key={ad.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      {ad.platform || "General"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-3">{ad.headline}</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{ad.description}</p>
                  <p className="text-indigo-600 font-bold mb-8 italic">{ad.cta}</p>
                </div>

                <div className="flex gap-3 border-t border-slate-50 pt-6">
                  <button
                    onClick={() => handleCopy(ad)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <Copy size={18} /> Copy
                  </button>
                  <button
                    onClick={() => handleDelete(ad.id)}
                    className="flex items-center justify-center p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Reusable Sidebar Component (Matches Dashboard)
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all duration-200 ${
      active ? "bg-white/15 text-white shadow-inner" : "text-indigo-200 hover:bg-white/5 hover:text-white"
    }`}
  >
    {icon} <span className="font-semibold text-sm">{label}</span>
  </button>
);

export default MyAds;