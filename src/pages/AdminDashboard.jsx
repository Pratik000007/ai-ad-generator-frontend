import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; 
import { 
  Users, Presentation, LayoutDashboard, TrendingUp, 
  ShieldCheck, LogOut, Trash2, Mail, Shield 
} from "lucide-react"; 

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard"); // ✅ State to switch views
  const [stats, setStats] = useState({ totalUsers: 0, totalAds: 0 });
  const [users, setUsers] = useState([]); // ✅ State for user list
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Dashboard Stats
    api.get("/admin/dashboard")
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard Error:", err);
        setLoading(false);
      });

    // ✅ Fetch Users List (Assuming your backend has this endpoint)
    api.get("/admin/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("User Fetch Error:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-indigo-600 font-bold italic">Initializing Admin Console...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-indigo-900 text-white hidden md:flex flex-col p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-500 p-2 rounded-lg"><ShieldCheck size={24} /></div>
          <span className="text-xl font-black tracking-tight uppercase">Admin</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <SidebarLink 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <SidebarLink 
            active={activeTab === "users"} 
            onClick={() => setActiveTab("users")} 
            icon={<Users size={20} />} 
            label="User Management" 
          />
          <SidebarLink 
            active={activeTab === "campaigns"} 
            onClick={() => setActiveTab("campaigns")} 
            icon={<Presentation size={20} />} 
            label="All Campaigns" 
          />
        </nav>

        <div className="pt-6 border-t border-indigo-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-300 hover:bg-red-500/10 rounded-xl font-semibold transition">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-gray-900">
            {activeTab === "dashboard" ? "Analytics Overview" : "User Management"}
          </h1>
          <AdminProfileChip name="Pratik Mendhe" email="mendhepratik24@gmail.com" />
        </header>

        {activeTab === "dashboard" ? (
          /* --- DASHBOARD VIEW --- */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="text-blue-600" />} bg="bg-blue-50" trend="+12%" />
              <StatCard title="AI Ads Generated" value={stats.totalAds} icon={<Presentation className="text-purple-600" />} bg="bg-purple-50" trend="+24%" />
              <StatCard title="Revenue" value="$4,250" icon={<TrendingUp className="text-emerald-600" />} bg="bg-emerald-50" trend="+5%" />
              <StatCard title="Server Health" value="99.9%" icon={<ShieldCheck className="text-orange-600" />} bg="bg-orange-50" />
            </div>
            <ActivityPlaceholder />
          </>
        ) : (
          /* --- USER MANAGEMENT VIEW --- */
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-5 text-xs font-bold uppercase text-gray-400">User</th>
                  <th className="p-5 text-xs font-bold uppercase text-gray-400">Role</th>
                  <th className="p-5 text-xs font-bold uppercase text-gray-400">Status</th>
                  <th className="p-5 text-xs font-bold uppercase text-gray-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length > 0 ? users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{u.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5"><span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-md uppercase">{u.role}</span></td>
                    <td className="p-5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2"></span><span className="text-sm text-gray-600 font-medium">Active</span></td>
                    <td className="p-5 text-center">
                      <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="p-10 text-center text-gray-400">No users found in database.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Helper Components ---

function SidebarLink({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded-xl transition font-medium ${active ? 'bg-white/10 text-white' : 'text-indigo-200 hover:bg-white/5'}`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ title, value, icon, bg, trend }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className={`${bg} p-3 rounded-2xl`}>{icon}</div>
        {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
      </div>
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function AdminProfileChip({ name, email }) {
  return (
    <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-gray-100">
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">P</div>
      <div className="text-left">
        <p className="text-sm font-bold text-gray-900 leading-tight">{name}</p>
        <p className="text-[10px] text-gray-400">{email}</p>
      </div>
    </div>
  );
}

function ActivityPlaceholder() {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Recent System Activity</h3>
      <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 gap-2 font-medium">
        <TrendingUp size={32} className="opacity-20" />
        <p className="text-sm">Activity logs appearing in real-time...</p>
      </div>
    </div>
  );
}

export default AdminDashboard;