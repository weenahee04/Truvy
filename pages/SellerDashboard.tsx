import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, TrendingUp, DollarSign, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export const SellerDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar - Yellow Background */}
      <aside className="w-64 bg-brand-gold text-slate-900 hidden lg:flex flex-col border-r border-slate-200 shrink-0">
        <div className="p-6">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Truvamate</h2>
          <span className="text-xs uppercase tracking-widest text-slate-800 font-bold">Seller Center</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link to="/seller" className="flex items-center gap-3 px-4 py-3 bg-black text-brand-gold rounded-lg font-bold shadow-md">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/seller/products" className="flex items-center gap-3 px-4 py-3 text-slate-800 hover:bg-black/10 rounded-lg transition-colors font-medium">
            <Package size={20} /> Products
          </Link>
          <Link to="/seller/orders" className="flex items-center gap-3 px-4 py-3 text-slate-800 hover:bg-black/10 rounded-lg transition-colors font-medium">
            <ShoppingBag size={20} /> Orders <span className="ml-auto bg-slate-900 text-brand-gold text-[10px] px-2 py-0.5 rounded-full font-bold">5</span>
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-800 hover:bg-black/10 rounded-lg transition-colors font-medium">
            <Users size={20} /> Customers
          </a>
           <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-800 hover:bg-black/10 rounded-lg transition-colors font-medium">
            <Settings size={20} /> Shop Settings
          </a>
        </nav>

        <div className="p-4 border-t border-black/10">
           <Link to="/" className="flex items-center gap-3 px-4 py-2 text-slate-800 hover:text-black font-medium transition-colors w-full">
            <LogOut size={18} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-8">
           <h1 className="font-bold text-slate-900 text-lg uppercase tracking-wide">Dashboard Overview</h1>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">My US Shop</div>
                <div className="text-xs text-slate-500">Verified Seller</div>
              </div>
              <div className="h-10 w-10 bg-brand-gold rounded-full border-2 border-slate-900"></div>
           </div>
        </header>

        <div className="p-8 space-y-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Revenue</div>
                <div className="p-2 bg-brand-gold/20 text-slate-900 rounded-lg"><DollarSign size={20} /></div>
              </div>
              <div className="text-4xl font-black text-slate-900">฿124,500</div>
              <div className="flex items-center gap-1 text-green-600 text-sm mt-2 font-bold">
                <TrendingUp size={16} /> +12.5% from last month
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Orders to Ship</div>
                <div className="p-2 bg-slate-100 text-slate-900 rounded-lg"><Package size={20} /></div>
              </div>
              <div className="text-4xl font-black text-slate-900">12</div>
              <div className="text-slate-400 text-sm mt-2 font-medium">Requires immediate action</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Products</div>
                <div className="p-2 bg-slate-100 text-slate-900 rounded-lg"><ShoppingBag size={20} /></div>
              </div>
              <div className="text-4xl font-black text-slate-900">45</div>
              <div className="text-slate-400 text-sm mt-2 font-medium">5 Low stock items</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Weekly Sales</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#000', fontSize: 12, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '0px', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'}} />
                    <Bar dataKey="sales" fill="#FFD700" radius={[0, 0, 0, 0]} barSize={40} stroke="#000" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Visitor Trends</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#000', fontSize: 12, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '0px', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'}} />
                    <Line type="monotone" dataKey="sales" stroke="#000" strokeWidth={3} dot={{r: 4, fill: '#FFD700', strokeWidth: 2}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Recent Orders</h3>
              <Link to="/seller/orders" className="text-sm text-slate-900 underline hover:no-underline font-bold">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-900">Order ID</th>
                    <th className="px-6 py-4 font-bold text-slate-900">Product</th>
                    <th className="px-6 py-4 font-bold text-slate-900">Customer</th>
                    <th className="px-6 py-4 font-bold text-slate-900">Status</th>
                    <th className="px-6 py-4 font-bold text-slate-900 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1,2,3,4,5].map((i) => (
                    <tr key={i} className="hover:bg-yellow-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">#ORD-2023-00{i}</td>
                      <td className="px-6 py-4 text-slate-600">Vitamin C 1000mg...</td>
                      <td className="px-6 py-4 text-slate-600">Khun Somchai</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${i === 1 ? 'bg-yellow-100 text-slate-900 border-yellow-300' : 'bg-green-100 text-green-800 border-green-200'}`}>
                          {i === 1 ? 'Pending' : 'Shipped'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">฿590</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};