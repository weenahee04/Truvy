import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Users, Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const SellerProducts: React.FC = () => {
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
          <Link to="/seller/products" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-lg">
            <Package size={20} /> Products
          </Link>
          <Link to="/seller/orders" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
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
           <h1 className="font-bold text-slate-800 text-lg">Product Management</h1>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">My US Shop</div>
                <div className="text-xs text-slate-500">Verified Seller</div>
              </div>
              <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
           </div>
        </header>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-brand-navy text-white rounded-lg text-sm font-medium">All Products</button>
              <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Active</button>
              <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Sold Out</button>
            </div>
            <Button className="gap-2"><Plus size={18} /> Add New Product</Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product Name</th>
                    <th className="px-6 py-4 font-medium">SKU</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium">Sales</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 rounded object-cover overflow-hidden">
                            <img src={`https://picsum.photos/100/100?random=${i+50}`} className="w-full h-full object-cover" alt="product" />
                          </div>
                          <span className="font-medium text-slate-900 line-clamp-1 max-w-xs">US Import Product Sample Item {i}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">SKU-2023-00{i}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">฿590</td>
                      <td className="px-6 py-4 text-slate-600">120</td>
                      <td className="px-6 py-4 text-slate-600">45</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded"><Pencil size={16} /></button>
                          <button className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
               <span>Showing 1-5 of 24 products</span>
               <div className="flex gap-2">
                 <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Previous</button>
                 <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Next</button>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};