import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { LayoutDashboard, Image, Type, Save, LogOut, ArrowLeft, ExternalLink, ImagePlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { siteContent, updateSiteContent } = useGlobal();
  const [activeTab, setActiveTab] = useState<'hero' | 'promo' | 'category'>('hero');
  
  // Local state for form handling before saving
  const [formData, setFormData] = useState(siteContent);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (section: keyof typeof siteContent, index: number | null, field: string, value: string) => {
    setFormData(prev => {
      if (section === 'hero') {
        return {
          ...prev,
          hero: { ...prev.hero, [field]: value }
        };
      }
      
      if (Array.isArray(prev[section]) && index !== null) {
        const newArray = [...prev[section] as any[]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
      }
      return prev;
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    updateSiteContent(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-tighter text-brand-gold uppercase">Truvamate</h2>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Admin Panel</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link 
            to="/admin/banners"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-brand-gold bg-slate-800 hover:bg-brand-gold hover:text-slate-900 border border-brand-gold/30"
          >
            <ImagePlus size={20} /> Banner Management
          </Link>
          <div className="border-t border-slate-700 my-3"></div>
          <button 
            onClick={() => setActiveTab('hero')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'hero' ? 'bg-brand-gold text-slate-900' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Type size={20} /> Main Hero Text
          </button>
          <button 
            onClick={() => setActiveTab('promo')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'promo' ? 'bg-brand-gold text-slate-900' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Image size={20} /> Promo Sliders
          </button>
          <button 
            onClick={() => setActiveTab('category')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'category' ? 'bg-brand-gold text-slate-900' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} /> Category Banners
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <Link to="/" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors w-full">
            <ArrowLeft size={18} /> Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
           <h1 className="font-bold text-slate-900 text-lg uppercase tracking-wide flex items-center gap-2">
             Editing: <span className="text-brand-gold bg-slate-900 px-2 py-0.5 rounded">{activeTab}</span>
           </h1>
           <div className="flex items-center gap-4">
              <Link to="/" target="_blank" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
                 View Live Site <ExternalLink size={14} />
              </Link>
              <Button onClick={handleSave} className="gap-2 shadow-lg" disabled={isSaved}>
                <Save size={18} /> {isSaved ? 'Saved!' : 'Save Changes'}
              </Button>
           </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          
          {/* Hero Editor */}
          {activeTab === 'hero' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h3 className="font-bold text-xl text-slate-900 mb-6 pb-4 border-b border-slate-100">Main Hero Section</h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Badge Text</label>
                  <input 
                    type="text" 
                    value={formData.hero.badge}
                    onChange={(e) => handleChange('hero', null, 'badge', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title Line 1</label>
                  <input 
                    type="text" 
                    value={formData.hero.titleLine1}
                    onChange={(e) => handleChange('hero', null, 'titleLine1', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-gold outline-none font-bold text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title Line 2 (Underlined)</label>
                  <input 
                    type="text" 
                    value={formData.hero.titleLine2}
                    onChange={(e) => handleChange('hero', null, 'titleLine2', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-gold outline-none font-bold text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea 
                    value={formData.hero.description}
                    onChange={(e) => handleChange('hero', null, 'description', e.target.value)}
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-gold outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Promo Banners Editor */}
          {activeTab === 'promo' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 mb-6">
                <strong>Tip:</strong> Use high-resolution landscape images (approx 1600x600) for best results.
              </div>
              {formData.promoBanners.map((banner, index) => (
                <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-900">Slide #{index + 1}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL</label>
                        <input 
                          type="text" 
                          value={banner.image}
                          onChange={(e) => handleChange('promoBanners', index, 'image', e.target.value)}
                          className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                        <input 
                          type="text" 
                          value={banner.title}
                          onChange={(e) => handleChange('promoBanners', index, 'title', e.target.value)}
                          className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                        <input 
                          type="text" 
                          value={banner.subtitle}
                          onChange={(e) => handleChange('promoBanners', index, 'subtitle', e.target.value)}
                          className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preview</label>
                      <div className="aspect-[16/6] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                        <img src={banner.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-4">
                           <h3 className="text-white font-black text-xl italic uppercase">{banner.title}</h3>
                           <p className="text-white text-xs">{banner.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Banners Editor */}
          {activeTab === 'category' && (
             <div className="grid grid-cols-1 gap-6">
               {formData.categoryBanners.map((banner, index) => (
                 <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex gap-6 items-start">
                    <div className="w-48 aspect-[16/10] bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      <img src={banner.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between">
                         <h4 className="font-bold text-slate-900">Card #{index + 1}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                          <input 
                            type="text" 
                            value={banner.title}
                            onChange={(e) => handleChange('categoryBanners', index, 'title', e.target.value)}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                          <input 
                            type="text" 
                            value={banner.subtitle}
                            onChange={(e) => handleChange('categoryBanners', index, 'subtitle', e.target.value)}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL</label>
                          <input 
                            type="text" 
                            value={banner.image}
                            onChange={(e) => handleChange('categoryBanners', index, 'image', e.target.value)}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-gold outline-none font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          )}

        </div>
      </main>
    </div>
  );
};