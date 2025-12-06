import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, CreditCard, Truck, Ticket, Dna, Receipt, Trophy, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const HowToUse: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'lotto'>('marketplace');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const MARKETPLACE_STEPS = [
    {
      id: 1,
      title: 'ค้นหาสินค้า',
      desc: 'เลือกซื้อสินค้าแบรนด์ดังจาก USA ผ่านหมวดหมู่ต่างๆ หรือใช้ช่องค้นหาเพื่อหาสิ่งที่คุณต้องการ',
      icon: Search
    },
    {
      id: 2,
      title: 'เพิ่มลงตะกร้า',
      desc: 'ตรวจสอบรายละเอียดสินค้า ราคา และรีวิว จากนั้นกดปุ่ม "เพิ่มลงตะกร้า" หรือ "ซื้อเลย"',
      icon: ShoppingBag
    },
    {
      id: 3,
      title: 'ชำระเงินปลอดภัย',
      desc: 'เลือกวิธีการชำระเงินที่สะดวก (บัตรเครดิต, โอนเงิน, TrueMoney) ผ่านระบบที่ปลอดภัย 100%',
      icon: CreditCard
    },
    {
      id: 4,
      title: 'รอรับสินค้า',
      desc: 'สินค้าจะถูกจัดส่งจาก USA มายังหน้าบ้านคุณ (ใช้เวลา 7-14 วันสำหรับ Air Freight) พร้อม Tracking Number',
      icon: Truck
    }
  ];

  const LOTTO_STEPS = [
    {
      id: 1,
      title: 'เลือกประเภทรางวัล',
      desc: 'เลือกเล่น Powerball หรือ Mega Millions ตามมูลค่า Jackpot ที่คุณต้องการลุ้น',
      icon: Trophy
    },
    {
      id: 2,
      title: 'เลือกตัวเลข',
      desc: 'เลือกเลขนำโชคของคุณเอง หรือใช้ระบบ Quick Pick เพื่อให้ระบบสุ่มเลขให้',
      icon: Dna
    },
    {
      id: 3,
      title: 'ยืนยันคำสั่งซื้อ',
      desc: 'ชำระเงินค่าบริการฝากซื้อ (150 บาท/ใบ) เราจะดำเนินการซื้อสลากจริงที่ตัวแทนจำหน่ายใน USA',
      icon: CheckCircle2
    },
    {
      id: 4,
      title: 'ตรวจสอบสลาก',
      desc: 'เจ้าหน้าที่จะสแกนใบสลากตัวจริงเข้าระบบ ท่านสามารถดูรูปสลากได้ที่เมนู "สลากของฉัน" ก่อนเวลาผลออก',
      icon: Receipt
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 pb-24">
      
      {/* Hero Header */}
      <div className="max-w-5xl mx-auto text-center mb-12 space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
          วิธีการใช้งาน <span className="text-brand-gold bg-slate-900 px-2 rounded inline-block transform -skew-x-6">Truvamate</span>
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          แพลตฟอร์มช้อปปิ้งสินค้าอเมริกาและบริการฝากซื้อ Lotto USA ที่ง่ายและปลอดภัยที่สุด เริ่มต้นใช้งานได้ใน 4 ขั้นตอน
        </p>
      </div>

      {/* Toggle Tabs */}
      <div className="max-w-md mx-auto bg-white p-1.5 rounded-full border border-slate-200 shadow-sm mb-12 flex relative">
        <div 
          className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-brand-navy rounded-full transition-all duration-300 ${activeTab === 'marketplace' ? 'left-1.5' : 'left-[calc(50%+4.5px)]'}`}
        ></div>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold relative z-10 transition-colors ${activeTab === 'marketplace' ? 'text-white' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <ShoppingBag size={18} /> ซื้อสินค้า USA
        </button>
        <button 
          onClick={() => setActiveTab('lotto')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold relative z-10 transition-colors ${activeTab === 'lotto' ? 'text-brand-gold' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Ticket size={18} /> ซื้อ Lotto USA
        </button>
      </div>

      {/* Steps Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-slate-200 -z-0"></div>

          {(activeTab === 'marketplace' ? MARKETPLACE_STEPS : LOTTO_STEPS).map((step) => (
            <div key={step.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative z-10 h-full flex flex-col">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6 shadow-lg transform group-hover:scale-110 transition-transform ${activeTab === 'marketplace' ? 'bg-brand-navy' : 'bg-brand-gold text-slate-900'}`}>
                <step.icon size={28} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                  {step.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed flex-1">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-brand-gold/10 inline-block p-8 rounded-3xl border border-brand-gold/20">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">พร้อมเริ่มต้นหรือยัง?</h3>
            <p className="text-slate-600 mb-6">สมัครสมาชิกวันนี้เพื่อรับสิทธิพิเศษและติดตามสถานะคำสั่งซื้อได้ทันที</p>
            <Button size="lg" className="shadow-xl text-lg px-8 gap-2" onClick={() => navigate(activeTab === 'marketplace' ? '/' : '/lotto')}>
              {activeTab === 'marketplace' ? 'เริ่มช้อปปิ้งเลย' : 'เลือกเลขนำโชค'} <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Mini Section */}
      <div className="max-w-3xl mx-auto mt-20 pt-12 border-t border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center justify-center gap-2">
          <HelpCircle className="text-slate-400" /> คำถามที่พบบ่อย
        </h3>
        <div className="space-y-4">
          <details className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-slate-900 hover:bg-slate-50">
              สินค้าเป็นของแท้หรือไม่?
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-slate-600">
              สินค้าทุกชิ้นใน Truvamate นำเข้าจากตัวแทนจำหน่ายและช็อปอย่างเป็นทางการใน USA รับประกันของแท้ 100% หากพบของปลอมยินดีคืนเงิน
            </div>
          </details>
          <details className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-slate-900 hover:bg-slate-50">
              ถ้าถูกรางวัล Lotto จะขึ้นเงินอย่างไร?
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-slate-600">
              หากท่านถูกรางวัลเล็ก ยอดเงินจะโอนเข้าบัญชี Truvamate ของท่านทันที หากถูกรางวัลใหญ่ (Jackpot) ทีมงานจะพาท่านเดินทางไปขึ้นรางวัลที่ USA หรือดำเนินการแทนตามหนังสือมอบอำนาจ (มีค่าธรรมเนียมตามตกลง)
            </div>
          </details>
          <details className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-slate-900 hover:bg-slate-50">
              ระยะเวลาจัดส่งนานแค่ไหน?
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-slate-600">
              สินค้าส่วนใหญ่ส่งแบบ Air Freight ใช้เวลาประมาณ 7-14 วันทำการหลังจากสินค้าออกจากโกดัง USA
            </div>
          </details>
        </div>
      </div>

    </div>
  );
};
