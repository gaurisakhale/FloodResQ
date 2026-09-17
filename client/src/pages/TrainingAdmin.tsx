import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, ShieldCheck, Video, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';

export const TrainingAdmin: React.FC = () => {
  const [videos, setVideos] = useState([
    { id: 'VID-01', title: 'Himalayan Flash Flood Survival & High Ground Evacuation', category: 'What To Do During a Flood', language: 'Hindi', state: 'Uttarakhand', priority: 'HIGH', enabled: true, isVerified: true },
    { id: 'VID-02', title: 'Landslide Warning Signs & Mountain Slope Hazard Identification', category: 'Landslide Safety', language: 'English', state: 'Himachal Pradesh', priority: 'HIGH', enabled: true, isVerified: true },
    { id: 'VID-03', title: 'Emergency First Aid Basics for Mountain Traumatic Injuries', category: 'First Aid Basics', language: 'Hindi', state: 'All States', priority: 'CRITICAL', enabled: true, isVerified: true },
    { id: 'VID-04', title: 'How to Send Satellite SOS & Use Satellite Emergency Protocols', category: 'How to Send SOS', language: 'English', state: 'All States', priority: 'HIGH', enabled: true, isVerified: true },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Flash Flood Prevention',
    language: 'Hindi',
    state: 'Uttarakhand',
    priority: 'HIGH',
    isVerified: true,
    videoUrl: '',
    description: ''
  });

  const handleToggleEnable = (id: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, enabled: !v.enabled } : v));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this educational video resource?')) {
      setVideos(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVid = {
      id: `VID-${Date.now().toString().slice(-4)}`,
      ...formData,
      enabled: true
    };
    setVideos([newVid, ...videos]);
    setModalOpen(false);
    setFormData({
      title: '',
      category: 'Flash Flood Prevention',
      language: 'Hindi',
      state: 'Uttarakhand',
      priority: 'HIGH',
      isVerified: true,
      videoUrl: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Training & Educational Content Management</h1>
          <p className="text-slate-500 text-sm">Authorized Admin & Government Portal for Video Library Curation</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <PlusCircle className="w-4 h-4 text-cyan-400" /> Add Educational Video
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-900 text-sm">Managed Educational Video Resources</h3>
          <span className="text-xs text-slate-400 font-bold">Total Videos: {videos.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Resource ID & Title</th>
                <th className="p-4">Disaster Category</th>
                <th className="p-4">Language & State</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {videos.map(v => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900 text-sm">{v.title}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{v.id}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{v.category}</td>
                  <td className="p-4 text-slate-600">
                    <div>{v.language}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{v.state}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
                      {v.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    {v.isVerified ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Govt Verified
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">Standard</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleEnable(v.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all ${
                        v.enabled ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {v.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button onClick={() => handleDelete(v.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200" title="Delete Video">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Video Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative text-xs">
            <button type="button" onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-600" /> Add Educational Disaster Video
            </h3>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase">Video Title *</label>
              <input required type="text" className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase">Category</label>
                <select className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Flash Flood Prevention">Flash Flood Prevention</option>
                  <option value="Landslide Safety">Landslide Safety</option>
                  <option value="Avalanche Safety">Avalanche Safety</option>
                  <option value="First Aid Basics">First Aid Basics</option>
                  <option value="How to Send SOS">How to Send SOS</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase">Language</label>
                <select className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Assamese">Assamese</option>
                  <option value="Nepali">Nepali</option>
                  <option value="Urdu">Urdu</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase">State</label>
                <input type="text" className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase">Priority</label>
                <select className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="govVerif" checked={formData.isVerified} onChange={e => setFormData({...formData, isVerified: e.target.checked})} className="rounded text-cyan-600 w-4 h-4" />
              <label htmlFor="govVerif" className="font-bold text-slate-800">Mark as Government Verified Resource</label>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider">
              Save Educational Video
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
