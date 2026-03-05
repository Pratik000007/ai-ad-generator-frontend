import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/userApi";
import axiosInstance from "../api/axiosInstance";

import { 
  LayoutDashboard, 
  PlusCircle, 
  Files, 
  LogOut, 
  Zap, 
  Globe, 
  BarChart3,
  Menu,
  X
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, Filler);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [trendData, setTrendData] = useState(null);
  
  // 📱 Mobile Menu State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        const analyticsRes = await axiosInstance.get("/analytics");
        setAnalytics(analyticsRes.data);

        const trendRes = await axiosInstance.get("/analytics/monthly-trend");

        const formatMonth = (monthString) => {
          const date = new Date(monthString + "-01");
          return date.toLocaleString("default", { month: "short" });
        };

        const labels = trendRes.data.map((item) => formatMonth(item.month));
        const values = trendRes.data.map((item) => item.count);

        setTrendData({
          labels,
          datasets: [{
            label: "Ads Generated",
            data: values,
            borderColor: "#6366f1",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            backgroundColor: "rgba(99,102,241,0.1)",
          }],
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600 font-bold">Loading Workspace...</div>;
  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      
      {/* 📱 MOBILE NAVIGATION BAR */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-indigo-900 text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Zap size={24} fill="white" className="text-indigo-400" />
          <span className="text-lg font-black italic">ADGEN.AI</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
          <Menu size={28} />
        </button>
      </div>

      {/* 💻 SIDEBAR (Desktop Fixed & Mobile Overlay) */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-64 bg-indigo-900 text-white p-6 shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col
      `}>
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg shadow-lg">
              <Zap size={22} fill="white" />
            </div>
            <span className="text-xl font-black tracking-tight italic">ADGEN.AI</span>
          </div>
          {/* Close Button for Mobile */}
          <button className="lg:hidden p-2 hover:bg-white/10 rounded-full" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active onClick={() => {navigate("/dashboard"); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<PlusCircle size={20}/>} label="Create New Ad" onClick={() => {navigate("/create-ad"); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<Files size={20}/>} label="My Library" onClick={() => {navigate("/my-ads"); setIsSidebarOpen(false);}} />
        </nav>

        <div className="pt-6 border-t border-indigo-800">
           <SidebarItem icon={<LogOut size={20}/>} label="Sign Out" onClick={handleLogout} />
        </div>
      </aside>

      {/* Dark Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Hello, {user?.name.split(' ')[0]}!</h1>
            <p className="text-slate-500 font-medium text-sm lg:text-base">Monitor your campaign performance.</p>
          </div>
          <button 
            onClick={() => navigate("/create-ad")}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} /> Generate New Ad
          </button>
        </header>

        {/* KPI Stats Grid - Optimized Stacking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Projects" value={analytics.totalProducts} icon={<Files size={20} className="text-blue-600"/>} bg="bg-blue-50" />
          <StatCard title="Total Ads" value={analytics.totalAds} icon={<Zap size={20} className="text-indigo-600"/>} bg="bg-indigo-50" />
          <StatCard title="This Month" value={analytics.adsThisMonth} icon={<BarChart3 size={20} className="text-emerald-600"/>} bg="bg-emerald-50" />
          <StatCard title="Last 7 Days" value={analytics.adsLast7Days} icon={<Globe size={20} className="text-amber-600"/>} bg="bg-amber-50" />
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 lg:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Growth Analysis</h3>
            <div className="h-[250px] lg:h-[300px]">
              {trendData ? <Line data={trendData} options={lineOptions} /> : <p>Loading trend...</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Volume</h3>
              <div className="h-[200px]">
                <Bar data={getBarData(analytics)} options={barOptions} />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Platforms</h3>
              <div className="h-64 flex justify-center">
                <Pie data={getPieData(analytics.platformBreakdown)} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

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

const StatCard = ({ title, value, icon, bg }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center lg:flex-col lg:items-start gap-4 transition-transform active:scale-[0.98]">
    <div className={`${bg} p-3 rounded-2xl`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest">{title}</p>
      <h2 className="text-xl lg:text-3xl font-black text-slate-800 leading-tight">{value}</h2>
    </div>
  </div>
);

// --- CHART HELPERS (UNCHANGED) ---
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" }, ticks: { precision: 0 } } }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { display: false }, x: { grid: { display: false } } }
};

const getBarData = (analytics) => ({
  labels: ["Total", "Monthly", "Weekly"],
  datasets: [{
    data: [analytics.totalAds, analytics.adsThisMonth, analytics.adsLast7Days],
    backgroundColor: ["#6366f1", "#8b5cf6", "#d946ef"],
    borderRadius: 12,
  }]
});

const getPieData = (breakdown = {}) => ({
  labels: ["Insta", "FB", "LinkedIn", "Google"],
  datasets: [{
    data: [breakdown.instagram || 0, breakdown.facebook || 0, breakdown.linkedin || 0, breakdown.google || 0],
    backgroundColor: ["#E1306C", "#1877F2", "#0A66C2", "#F4B400"],
    borderWidth: 0,
  }]
});

export default Dashboard;