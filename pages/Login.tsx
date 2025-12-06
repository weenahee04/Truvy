import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { login } = useGlobal();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    login(email || 'user@example.com');
    navigate('/profile');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-navy mb-2">
              {isLogin ? 'ยินดีต้อนรับกลับ' : 'สร้างบัญชีใหม่'}
            </h1>
            <p className="text-slate-500">
              {isLogin ? 'เข้าสู่ระบบเพื่อจัดการคำสั่งซื้อของคุณ' : 'สมัครสมาชิกเพื่อรับสิทธิพิเศษมากมาย'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="ชื่อ - นามสกุล" 
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                placeholder="อีเมล" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="รหัสผ่าน" 
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                required
                defaultValue="password"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-brand-blue hover:underline">ลืมรหัสผ่าน?</a>
              </div>
            )}

            <Button className="w-full py-3 text-lg mt-2" type="submit">
              {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'} <ArrowRight size={20} className="ml-2" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">หรือดำเนินการต่อด้วย</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700">
              <Facebook size={20} className="text-blue-600" /> Facebook
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700">
              <span className="font-bold text-red-500">G</span> Google
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center text-sm text-slate-600 border-t border-slate-100">
          {isLogin ? 'ยังไม่มีบัญชีผู้ใช้?' : 'มีบัญชีอยู่แล้ว?'}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-brand-navy font-bold ml-1 hover:underline"
          >
            {isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </div>
    </div>
  );
};