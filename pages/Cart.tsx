import React from 'react';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQty } = useGlobal();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.priceTHB * item.quantity), 0);
  const shipping = subtotal > 2500 ? 0 : 45;
  const discount = 0;
  const total = subtotal + shipping - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
          <ShoppingCart size={48} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">ตะกร้าสินค้าว่างเปล่า</h1>
        <p className="text-slate-500 mb-8">ยังไม่มีสินค้าในตะกร้า เลือกช้อปสินค้าคุณภาพจาก USA ได้เลย</p>
        <Link to="/">
          <Button size="lg">ไปช้อปเลย</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">ตะกร้าสินค้า ({cart.length} รายการ)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 md:gap-6 items-start">
              <input type="checkbox" className="mt-2 h-5 w-5 rounded border-slate-300 text-brand-navy focus:ring-brand-navy" defaultChecked />
              <div className="h-24 w-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                 <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-slate-900 text-sm md:text-base line-clamp-2">{item.title}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
                <div className="text-xs text-slate-500 mt-1 mb-2">ตัวเลือก: {item.selectedOption}</div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="font-bold text-brand-navy text-lg">฿{item.priceTHB.toLocaleString()}</div>
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button onClick={() => updateCartQty(item.id, -1)} className="p-1 hover:bg-slate-100"><Minus size={16} /></button>
                    <input className="w-10 text-center text-sm focus:outline-none" value={item.quantity} readOnly />
                    <button onClick={() => updateCartQty(item.id, 1)} className="p-1 hover:bg-slate-100"><Plus size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">สรุปคำสั่งซื้อ</h3>
            <div className="space-y-3 text-sm border-b border-slate-100 pb-4 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>ยอดรวมสินค้า ({cart.reduce((a, b) => a + b.quantity, 0)} ชิ้น)</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ค่าจัดส่ง (Air Freight)</span>
                <span>{shipping === 0 ? 'ฟรี' : `฿${shipping}`}</span>
              </div>
              <div className="flex justify-between text-brand-red">
                <span>ส่วนลด</span>
                <span>-฿{discount}</span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-6">
              <span className="font-bold text-slate-900">ยอดรวมสุทธิ</span>
              <span className="text-2xl font-bold text-brand-navy">฿{total.toLocaleString()}</span>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                 <input type="text" placeholder="ใส่โค้ดส่วนลด" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                 <Button variant="outline" size="sm">ใช้โค้ด</Button>
              </div>
              <Button className="w-full h-12 text-lg" onClick={() => navigate('/checkout')}>ดำเนินการชำระเงิน</Button>
              <Link to="/" className="block text-center text-sm text-slate-500 hover:text-brand-navy">ซื้อสินค้าต่อ</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};