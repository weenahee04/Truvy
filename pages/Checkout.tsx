import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { MapPin, CreditCard, Banknote, CheckCircle2, Wallet, QrCode, Ticket as TicketIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export const Checkout: React.FC = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, placeOrder, clearCart } = useGlobal();
  
  // Logic to handle Lotto Checkout vs Normal Cart Checkout
  const isLotto = location.state?.source === 'lotto';
  const lottoTickets = location.state?.tickets || [];
  
  // Determine Items
  const items = isLotto ? lottoTickets : cart;

  // Calculate Totals
  const subtotal = isLotto 
    ? lottoTickets.length * 150 
    : cart.reduce((sum, item) => sum + (item.priceTHB * item.quantity), 0);
  
  const shipping = isLotto ? 0 : (subtotal > 2500 ? 0 : 45);
  const total = subtotal + shipping;

  // Initialize step 2 if lotto
  useEffect(() => {
    if (isLotto) setStep(2);
  }, [isLotto]);

  const handleConfirmOrder = () => {
    // Save to global history
    placeOrder({
      id: `ORD-2023-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
      items: items,
      total: total,
      status: isLotto ? 'Waiting for Draw' : 'Pending',
      type: isLotto ? 'lotto' : 'marketplace',
      paymentMethod: paymentMethod
    });

    // Clear cart if it was a marketplace order
    if (!isLotto) {
      clearCart();
    }

    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="h-24 w-24 bg-brand-gold rounded-full flex items-center justify-center text-slate-900 mb-6 shadow-xl animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">สั่งซื้อสำเร็จ!</h1>
        <p className="text-slate-600 mb-8 font-medium">ขอบคุณที่ไว้วางใจ Truvamate<br/>คุณสามารถตรวจสอบสถานะได้ที่หน้าบัญชีของฉัน</p>
        <div className="flex gap-4">
          <Link to="/profile">
            <Button variant="outline">ดูรายการสั่งซื้อ</Button>
          </Link>
          <Link to="/">
            <Button>กลับสู่หน้าหลัก</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10 gap-4 text-sm font-bold">
        {/* Step 1 is only for physical goods */}
        {!isLotto && (
          <>
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-navy' : 'text-slate-300'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-brand-navy bg-brand-navy text-white' : 'border-slate-300'}`}>1</div>
              ที่อยู่จัดส่ง
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'text-brand-navy bg-brand-navy' : 'bg-slate-200'}`}></div>
          </>
        )}
        
        <div className={`flex items-center gap-2 ${(step >= 2 || isLotto) ? 'text-brand-navy' : 'text-slate-300'}`}>
           <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${(step >= 2 || isLotto) ? 'border-brand-navy bg-brand-navy text-white' : 'border-slate-300'}`}>
             {isLotto ? 1 : 2}
           </div>
          ชำระเงิน
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Address (Skipped for Lotto) */}
          {step === 1 && !isLotto && (
            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="bg-brand-gold p-2 rounded-lg text-slate-900">
                  <MapPin size={24} />
                </div>
                ที่อยู่สำหรับจัดส่ง
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">ชื่อ - นามสกุล</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none" defaultValue="สมชาย ใจดี" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">เบอร์โทรศัพท์</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none" defaultValue="081-234-5678" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">ที่อยู่</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none" defaultValue="123/45 คอนโดลุมพินี ถนนพระราม 9" />
                </div>
                 <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">จังหวัด</label>
                  <select className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none bg-white">
                    <option>กรุงเทพมหานคร</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">รหัสไปรษณีย์</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none" defaultValue="10310" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} size="lg" className="px-8 font-bold">ดำเนินการต่อ</Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment (Or Step 1 for Lotto) */}
          {(step === 2 || isLotto) && (
            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="bg-brand-gold p-2 rounded-lg text-slate-900">
                  <CreditCard size={24} />
                </div>
                วิธีการชำระเงิน
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                
                {/* Credit Card */}
                <label className={`relative flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${paymentMethod === 'card' ? 'border-brand-navy bg-slate-50' : 'border-slate-100 hover:border-brand-gold'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                      <CreditCard size={24} className="text-slate-900" />
                    </div>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-brand-navy" />
                  </div>
                  <div className="font-bold text-slate-900 mb-1">Credit / Debit Card</div>
                  <div className="text-xs text-slate-500 mb-3">Visa, Mastercard, JCB</div>
                  <div className="flex gap-2 mt-auto">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 object-contain" alt="Visa"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4 object-contain" alt="Mastercard"/>
                  </div>
                </label>

                {/* TrueMoney */}
                <label className={`relative flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${paymentMethod === 'truemoney' ? 'border-brand-navy bg-slate-50' : 'border-slate-100 hover:border-brand-gold'}`}>
                  <div className="flex justify-between items-start mb-4">
                     <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-sm h-10 w-10 flex items-center justify-center">
                        <Wallet size={20} className="text-orange-500" />
                     </div>
                    <input type="radio" name="payment" value="truemoney" checked={paymentMethod === 'truemoney'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-brand-navy" />
                  </div>
                  <div className="font-bold text-slate-900 mb-1">TrueMoney Wallet</div>
                  <div className="text-xs text-slate-500 mb-3">ชำระผ่านแอพทรูมันนี่</div>
                  <div className="mt-auto">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/TrueMoney_Wallet_Logo.svg/1200px-TrueMoney_Wallet_Logo.svg.png" className="h-4 object-contain" alt="TrueMoney"/>
                  </div>
                </label>

                 {/* Alipay */}
                <label className={`relative flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${paymentMethod === 'alipay' ? 'border-brand-navy bg-slate-50' : 'border-slate-100 hover:border-brand-gold'}`}>
                  <div className="flex justify-between items-start mb-4">
                     <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-sm h-10 w-10 flex items-center justify-center">
                        <QrCode size={20} className="text-blue-500" />
                     </div>
                    <input type="radio" name="payment" value="alipay" checked={paymentMethod === 'alipay'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-brand-navy" />
                  </div>
                  <div className="font-bold text-slate-900 mb-1">Alipay / WeChat</div>
                  <div className="text-xs text-slate-500 mb-3">สแกน QR Code เพื่อชำระเงิน</div>
                  <div className="flex gap-2 mt-auto">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Alipay_logo.svg/2560px-Alipay_logo.svg.png" className="h-4 object-contain" alt="Alipay"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/WeChat_logo.svg/1024px-WeChat_logo.svg.png" className="h-4 object-contain" alt="WeChat"/>
                  </div>
                </label>

                 {/* Bank Transfer */}
                <label className={`relative flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${paymentMethod === 'bank' ? 'border-brand-navy bg-slate-50' : 'border-slate-100 hover:border-brand-gold'}`}>
                  <div className="flex justify-between items-start mb-4">
                     <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-sm h-10 w-10 flex items-center justify-center">
                        <Banknote size={20} className="text-green-600" />
                     </div>
                    <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-brand-navy" />
                  </div>
                  <div className="font-bold text-slate-900 mb-1">Bank Transfer</div>
                  <div className="text-xs text-slate-500 mb-3">โอนเงินผ่านบัญชีธนาคาร</div>
                </label>

              </div>

              <div className="flex justify-between">
                {!isLotto && (
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-500">ย้อนกลับ</Button>
                )}
                <div className={isLotto ? 'w-full flex justify-end' : ''}>
                   <Button onClick={handleConfirmOrder} size="lg" className="px-8 font-bold shadow-lg">ยืนยันการสั่งซื้อ</Button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">สรุปคำสั่งซื้อ</h3>
            
            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item: any, index: number) => (
                isLotto ? (
                   <div key={index} className="flex gap-3 items-center text-sm border-b border-slate-50 pb-2">
                      <div className="h-10 w-10 rounded-full bg-brand-gold flex items-center justify-center text-slate-900 font-bold shrink-0">
                        <TicketIcon size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{item.type || 'Lotto Ticket'}</div>
                        <div className="text-xs text-slate-500 tracking-wider">
                          {item.numbers.join(', ')} <span className="text-red-500 font-bold">[{item.special}]</span>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">฿150</div>
                   </div>
                ) : (
                  <div key={index} className="flex gap-3 text-sm border-b border-slate-50 pb-2">
                    <div className="h-12 w-12 bg-slate-100 rounded overflow-hidden shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold text-slate-900">฿{(item.priceTHB * item.quantity).toLocaleString()}</div>
                  </div>
                )
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-slate-100 pt-4 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>ยอดรวมสินค้า</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ค่าจัดส่ง</span>
                <span>{shipping === 0 ? 'ฟรี' : `฿${shipping}`}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-6 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900">ยอดรวมสุทธิ</span>
              <span className="text-2xl font-black text-brand-navy">฿{total.toLocaleString()}</span>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg flex gap-2 items-start">
               <CheckCircle2 size={16} className="text-brand-navy mt-0.5 shrink-0" />
               <p className="text-xs text-brand-navy font-medium">
                 การชำระเงินของคุณปลอดภัยด้วยระบบเข้ารหัสมาตรฐานสากล (SSL)
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};