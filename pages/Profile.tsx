
import React, { useState } from 'react';
import { User, Package, Heart, MapPin, Bell, LogOut, ChevronRight, Ticket, Dna, X, Calendar, Clock, Receipt, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useGlobal } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/Marketplace/ProductCard';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const { user, orders, wishlist, logout } = useGlobal();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const marketplaceOrders = orders.filter(o => o.type === 'marketplace');
  const lottoOrders = orders.filter(o => o.type === 'lotto');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
      
      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-brand-gold p-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-black text-brand-gold px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Official Ticket</span>
                   <span className="bg-white/30 text-slate-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">{selectedTicket.id || 'N/A'}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{selectedTicket.type || 'Powerball'}</h2>
                <div className="text-slate-800 font-bold text-sm flex items-center gap-2 mt-1">
                   <Calendar size={14} /> Draw Date: Sat, Oct 28
                </div>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="h-8 w-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
              
              {/* Numbers Display */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6 text-center">
                 <p className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-wider">Your Selected Numbers</p>
                 <div className="flex flex-wrap justify-center gap-3 mb-2">
                    {selectedTicket.numbers.map((num: number) => (
                      <div key={num} className="h-12 w-12 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center font-black text-xl text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {num}
                      </div>
                    ))}
                    <div className="h-12 w-12 rounded-full bg-red-600 border-2 border-red-800 flex items-center justify-center font-black text-xl text-white shadow-[2px_2px_0px_0px_rgba(153,27,27,1)]">
                      {selectedTicket.special}
                    </div>
                 </div>
              </div>

              {/* Status & Timeline */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">Status</span>
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Waiting for Draw</span>
                 </div>
                 <div className="p-4 text-sm space-y-4">
                    <div className="flex gap-4">
                       <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-brand-gold ring-4 ring-yellow-100"></div>
                          <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                       </div>
                       <div className="pb-4">
                          <div className="font-bold text-slate-900">Ticket Purchased</div>
                          <div className="text-xs text-slate-500">Transaction ID: {selectedTicket.orderId}</div>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                          <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                       </div>
                       <div className="pb-4">
                          <div className="font-bold text-slate-900">Physical Ticket Scanned</div>
                          <div className="text-xs text-slate-500">Verified by US Agent</div>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                       </div>
                       <div>
                          <div className="font-bold text-slate-900">Draw Result Announcement</div>
                          <div className="text-xs text-slate-500">Next Scheduled Draw</div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Scanned Image Placeholder */}
              <div>
                 <p className="text-slate-500 text-xs font-bold uppercase mb-2 tracking-wider flex items-center gap-2">
                    <Receipt size={14} /> Scanned Copy
                 </p>
                 <div className="aspect-[3/2] bg-slate-200 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                    <div className="w-16 h-16 bg-slate-300 rounded-full mb-3 animate-pulse"></div>
                    <p className="text-xs font-medium">Scanning in progress...</p>
                    <p className="text-[10px] mt-1">Ticket image will appear here once processed by our US team (approx. 2-4 hours before draw).</p>
                 </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white">
               <Button className="w-full" onClick={() => setSelectedTicket(null)}>Close Details</Button>
            </div>

          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 text-center">
            <div className="h-20 w-20 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={32} className="text-slate-400" />}
            </div>
            <h3 className="font-bold text-slate-900">{user.name}</h3>
            <p className="text-xs text-slate-500 mt-1">Member since {user.memberSince}</p>
          </div>

          <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-medium border-l-4 transition-colors ${activeTab === 'orders' ? 'bg-brand-navy/5 text-brand-navy border-brand-navy' : 'text-slate-600 hover:bg-slate-50 border-transparent'}`}
            >
              <Package size={18} /> คำสั่งซื้อของฉัน
            </button>
            <button 
              onClick={() => setActiveTab('lotto')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-medium border-l-4 transition-colors ${activeTab === 'lotto' ? 'bg-brand-navy/5 text-brand-navy border-brand-navy' : 'text-slate-600 hover:bg-slate-50 border-transparent'}`}
            >
              <Ticket size={18} /> สลากของฉัน
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-medium border-l-4 transition-colors ${activeTab === 'wishlist' ? 'bg-brand-navy/5 text-brand-navy border-brand-navy' : 'text-slate-600 hover:bg-slate-50 border-transparent'}`}
            >
              <Heart size={18} /> สินค้าที่ถูกใจ <span className="ml-auto bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">{wishlist.length}</span>
            </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-brand-navy transition-colors border-l-4 border-transparent">
              <MapPin size={18} /> ที่อยู่จัดส่ง
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-brand-navy transition-colors border-l-4 border-transparent">
              <User size={18} /> บัญชีของฉัน
            </button>
            <div className="border-t border-slate-100 my-1"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={18} /> ออกจากระบบ
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            
            {activeTab === 'orders' && (
              <>
                <div className="p-6 border-b border-slate-100">
                  <h1 className="text-xl font-bold text-slate-900">คำสั่งซื้อของฉัน</h1>
                </div>

                {/* Order Tabs */}
                <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
                  <button className="px-6 py-3 text-sm font-medium text-brand-navy border-b-2 border-brand-navy whitespace-nowrap">ทั้งหมด</button>
                  <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-brand-navy whitespace-nowrap">ที่ต้องชำระ</button>
                  <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-brand-navy whitespace-nowrap">ที่ต้องจัดส่ง</button>
                </div>

                {/* Order List */}
                <div className="p-6 space-y-6">
                  {marketplaceOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500">ยังไม่มีรายการคำสั่งซื้อ</p>
                      <Button className="mt-4" onClick={() => navigate('/')}>ไปช้อปเลย</Button>
                    </div>
                  ) : (
                    marketplaceOrders.map((order) => (
                      <div key={order.id} className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-4 py-3 flex justify-between items-center text-sm">
                          <div className="font-bold text-slate-700">Order: #{order.id}</div>
                          <div className="text-brand-blue font-medium">{order.status}</div>
                        </div>
                        {order.items.map((item: any, idx: number) => (
                           <div key={idx} className="p-4 border-t border-slate-100 flex gap-4">
                            <div className="h-20 w-20 bg-slate-100 rounded border border-slate-200 overflow-hidden shrink-0">
                              <img src={item.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 line-clamp-1">{item.title}</h4>
                              <div className="text-xs text-slate-500 mt-1">จำนวน: {item.quantity}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-brand-navy">฿{item.priceTHB.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                        <div className="bg-white px-4 py-3 border-t border-slate-100 flex justify-end items-center gap-4">
                          <div className="text-sm">ยอดคำสั่งซื้อทั้งหมด: <span className="text-xl font-bold text-brand-navy ml-2">฿{order.total.toLocaleString()}</span></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === 'lotto' && (
              <>
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Ticket className="text-brand-gold" /> สลากของฉัน
                  </h1>
                  <Button size="sm" onClick={() => navigate('/lotto')}>ซื้อสลากเพิ่ม</Button>
                </div>
                <div className="p-6 space-y-4">
                   {lottoOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Dna size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500">คุณยังไม่มีสลากในครอบครอง</p>
                    </div>
                  ) : (
                    lottoOrders.flatMap(order => order.items).map((ticket: any, i: number) => (
                      <div key={i} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-brand-gold transition-colors">
                        <div className="bg-slate-900 text-brand-gold px-4 py-2 flex justify-between items-center">
                          <span className="font-black tracking-widest uppercase text-sm">{ticket.type || 'Powerball'}</span>
                          <span className="text-xs font-bold text-slate-900 bg-brand-gold px-2 py-0.5 rounded">รอผลรางวัล</span>
                        </div>
                        <div className="p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex flex-col items-center sm:items-start gap-1">
                            <div className="text-xs text-slate-500">งวดประจำวันที่</div>
                            <div className="font-bold text-slate-900 text-sm">Sat, Oct 28</div>
                          </div>
                          <div className="flex gap-2">
                            {ticket.numbers.map((n: number) => (
                              <div key={n} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-900 shadow-sm text-sm sm:text-base">
                                {n}
                              </div>
                            ))}
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-600 text-white border-2 border-red-700 flex items-center justify-center font-bold shadow-md text-sm sm:text-base">
                              {ticket.special}
                            </div>
                          </div>
                          <div className="text-right">
                            <Button size="sm" variant="outline" onClick={() => setSelectedTicket({...ticket, orderId: 'ORD-LOTO'})}>ดูใบสลากจริง</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === 'wishlist' && (
              <>
                 <div className="p-6 border-b border-slate-100">
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Heart className="text-red-500" fill="currentColor" /> สินค้าที่ถูกใจ ({wishlist.length})
                  </h1>
                </div>
                <div className="p-6">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500">ยังไม่มีสินค้าในรายการโปรด</p>
                      <Button className="mt-4" onClick={() => navigate('/')}>ไปช้อปเลย</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
