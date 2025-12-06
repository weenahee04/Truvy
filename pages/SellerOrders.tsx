import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Search, Filter, Eye, Truck, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const SellerOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy text-white hidden lg:flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tighter text-brand-gold uppercase">Truvamate</h2>
          <span className="text-xs uppercase tracking-widest text-slate-400">Seller Center</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link to="/seller" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/seller/products" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Package size={20} /> Products
          </Link>
          <Link to="/seller/orders" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-lg">
            <ShoppingBag size={20} /> Orders
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Users size={20} /> Customers
          </a>
        </nav>

        <div className="p-4 border-t border-slate-700">
           <Link to="/" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors w-full">
            <LogOut size={18} /> Back to Shop
          </Link>
        </div>
      </aside>

      <main className="flex-1 w-full overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-8">
           <h1 className="font-bold text-slate-800 text-lg">Order Management</h1>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">My US Shop</div>
                <div className="text-xs text-slate-500">Verified Seller</div>
              </div>
              <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
           </div>
        </header>

        <div className="p-8">
           {/* Filters */}
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {['all', 'pending', 'shipping', 'completed', 'cancelled'].map(tab => (
                       <button 
                         key={tab}
                         onClick={() => setActiveTab(tab)}
                         className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                       >
                         {tab}
                       </button>
                    ))}
                 </div>
                 <div className="flex gap-2">
                    <div className="relative">
                       <input type="text" placeholder="Search Order ID" className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-brand-navy" />
                       <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2"><Filter size={16} /> Filter</Button>
                 </div>
              </div>
           </div>

           {/* Orders Table */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                   <tr>
                     <th className="px-6 py-4 font-medium">Order ID</th>
                     <th className="px-6 py-4 font-medium">Product(s)</th>
                     <th className="px-6 py-4 font-medium">Total Price</th>
                     <th className="px-6 py-4 font-medium">Status</th>
                     <th className="px-6 py-4 font-medium">Carrier</th>
                     <th className="px-6 py-4 font-medium text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {[1, 2, 3].map((i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-bold text-slate-900">#ORD-2023-00{i}</td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-slate-100 rounded object-cover overflow-hidden shrink-0">
                             <img src={`https://picsum.photos/100/100?random=${i+20}`} className="w-full h-full object-cover" alt="product" />
                           </div>
                           <div>
                              <div className="font-medium text-slate-900 line-clamp-1">Vitamin C 1000mg Kirkland</div>
                              <div className="text-xs text-slate-500">Qty: 1</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 font-bold text-slate-900">฿590</td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold border ${i === 1 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
                           {i === 1 ? 'Pending' : 'Shipped'}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-slate-600">{i === 1 ? '-' : 'Kerry Express'}</td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                           <Button size="sm" variant="outline" className="h-8 w-8 p-0 flex items-center justify-center"><Eye size={16} /></Button>
                           {i === 1 && (
                             <Button size="sm" className="h-8 gap-1 text-xs"><Truck size={14} /> Ship</Button>
                           )}
                         </div>
                       </td>
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