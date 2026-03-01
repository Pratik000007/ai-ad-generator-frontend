import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/userApi";
import axiosInstance from "../api/axiosInstance";

import { 
  LayoutDashboard, 
  PlusCircle, 
  Files, 
  LogOut, 
  User as UserIcon, 
  Zap, 
  Globe, 
  BarChart3 
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
          return date.toLocaleString("default", { month: "short", year: "numeric" });
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
            pointRadius: 4,
            backgroundColor: (context) => {
              const { chart } = context;
              const { ctx, chartArea } = chart;
              if (!chartArea) return null;
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, "rgba(99,102,241,0.2)");
              gradient.addColorStop(1, "rgba(99,102,241,0)");
              return gradient;
            },
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

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600 font-bold">Loading your workspace...</div>;
  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* --- SIDEBAR --- */}
      <aside className="w-68 bg-indigo-900 text-white hidden lg:flex flex-col p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-indigo-500 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
            <Zap size={22} fill="white" />
          </div>
          <span className="text-xl font-black tracking-tight italic">ADGEN.AI</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active onClick={() => navigate("/dashboard")} />
          <SidebarItem icon={<PlusCircle size={20}/>} label="Create New Ad" onClick={() => navigate("/create-ad")} />
          <SidebarItem icon={<Files size={20}/>} label="My Library" onClick={() => navigate("/my-ads")} />
        </nav>

        <div className="pt-6 border-t border-indigo-800">
           <SidebarItem icon={<LogOut size={20}/>} label="Sign Out" onClick={handleLogout} />
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Hello, {user?.name.split(' ')[0]}!</h1>
            <p className="text-slate-500 font-medium">Here's what's happening with your ad campaigns.</p>
          </div>
          <button 
            onClick={() => navigate("/create-ad")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
          >
            <PlusCircle size={20} /> Generate New Ad
          </button>
        </header>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="All Projects" value={analytics.totalProducts} icon={<Files size={20} className="text-blue-600"/>} bg="bg-blue-50" />
          <StatCard title="Total Ads" value={analytics.totalAds} icon={<Zap size={20} className="text-indigo-600"/>} bg="bg-indigo-50" />
          <StatCard title="Monthly Goal" value={analytics.adsThisMonth} icon={<BarChart3 size={20} className="text-emerald-600"/>} bg="bg-emerald-50" trend="On Track" />
          <StatCard title="Last 7 Days" value={analytics.adsLast7Days} icon={<Globe size={20} className="text-amber-600"/>} bg="bg-amber-50" />
        </div>

        {/* Monthly Trend (Main Chart) */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Growth Analysis</h3>
            <span className="text-sm text-slate-400 font-medium">Monthly Generation Trend</span>
          </div>
          <div className="h-[300px]">
            {trendData ? <Line data={trendData} options={lineOptions} /> : <p>Loading trend...</p>}
          </div>
        </div>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Volume</h3>
            <Bar data={getBarData(analytics)} options={barOptions} />
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Platform Distribution</h3>
            <div className="flex justify-center h-64">
              <Pie data={getPieData(analytics.platformBreakdown)} options={{ maintainAspectRatio: false }} />
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

const StatCard = ({ title, value, icon, bg, trend }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className={`${bg} p-3 rounded-2xl`}>{icon}</div>
      {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">{trend}</span>}
    </div>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
    <h2 className="text-3xl font-black text-slate-800 mt-1">{value}</h2>
  </div>
);

// --- CHART DATA HELPERS ---

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" }, ticks: { precision: 0 } } }
};

const barOptions = {
  plugins: { legend: { display: false } },
  scales: { y: { grid: { display: false }, ticks: { display: false } }, x: { grid: { display: false } } }
};

const getBarData = (analytics) => ({
  labels: ["Total", "Monthly", "Weekly"],
  datasets: [{
    data: [analytics.totalAds, analytics.adsThisMonth, analytics.adsLast7Days],
    backgroundColor: ["#6366f1", "#8b5cf6", "#d946ef"],
    borderRadius: 12,
    barThickness: 40,
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