import React, { useState, useEffect } from 'react';
import { PlayCircle, ShieldCheck, Search, Filter, CheckCircle2, BookOpen, X, Video } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DisasterTraining: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  const categories = [
    'ALL',
    'Flash Flood Prevention',
    'What To Do Before a Flood',
    'What To Do During a Flood',
    'What To Do After a Flood',
    'Landslide Safety',
    'Avalanche Safety',
    'Emergency Evacuation',
    'First Aid Basics',
    'Safe Drinking Water After Flood',
    'Electrical Safety During Flooding',
    'Mountain Road Safety',
    'How to Prepare an Emergency Kit',
    'How to Send SOS',
    'Family Disaster Preparedness'
  ];

  const initialVideos = [
    {
      id: 'VID-01',
      title: 'Himalayan Flash Flood Survival & High Ground Evacuation Protocol',
      category: 'What To Do During a Flood',
      language: 'Hindi',
      state: 'Uttarakhand',
      duration: '6:45',
      description: 'Official NDMA/SDMA guidelines on identifying flash flood warning signs, stream water color changes, and rapid evacuation to designated high ground.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=600&h=400',
      isVerified: true
    },
    {
      id: 'VID-02',
      title: 'Landslide Warning Signs & Mountain Slope Hazard Identification',
      category: 'Landslide Safety',
      language: 'English',
      state: 'Himachal Pradesh',
      duration: '8:12',
      description: 'How to spot tension cracks on slopes, sudden soil movement, tilted trees, and muddy spring water discharge in hill states.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1623863458639-50c180eb9a55?auto=format&fit=crop&q=80&w=600&h=400',
      isVerified: true
    },
    {
      id: 'VID-03',
      title: 'Emergency First Aid Basics for Mountain Traumatic Injuries',
      category: 'First Aid Basics',
      language: 'Hindi',
      state: 'All States',
      duration: '10:30',
      description: 'Essential field first aid for mountain rescue: controlling bleeding, improvised splints, treating cold shock, and administering CPR.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600&h=400',
      isVerified: true
    },
    {
      id: 'VID-04',
      title: 'How to Send Satellite SOS & Use Satellite Emergency Protocols',
      category: 'How to Send SOS',
      language: 'English',
      state: 'All States',
      duration: '4:50',
      description: 'Step-by-step guide for citizens and trek leaders on transmitting satellite SOS, sharing GPS coordinates, and tracking rescue responses.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80&w=600&h=400',
      isVerified: true
    },
    {
      id: 'VID-05',
      title: 'Safe Drinking Water Purification After Mountain Floods',
      category: 'Safe Drinking Water After Flood',
      language: 'Bengali',
      state: 'Assam',
      duration: '5:15',
      description: 'Preventing waterborne illnesses after flood contamination using chlorine tablets, solar disinfection, and portable filters.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1538356111056-a93a36d7cd84?auto=format&fit=crop&q=80&w=600&h=400',
      isVerified: true
    },
    {
      id: 'VID-06',
      title: 'Alpine Avalanche Safety & Snowpack Debris Search',
      category: 'Avalanche Safety',
      language: 'English',
      state: 'J&K',
      duration: '9:20',
      description: 'Understanding avalanche risk levels, using probes and transponders, and winter mountain safety protocols.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=600&h=400',
      isVerified: true
    }
  ];

  const filteredVideos = initialVideos.filter(v => {
    if (selectedCategory !== 'ALL' && v.category !== selectedCategory) return false;
    if (selectedLanguage !== 'ALL' && v.language !== selectedLanguage) return false;
    if (selectedState !== 'ALL' && v.state !== selectedState && v.state !== 'All States') return false;
    if (searchQuery && !v.title.toLowerCase().includes(searchQuery.toLowerCase()) && !v.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs uppercase tracking-wider border border-cyan-200">
          <BookOpen className="w-4 h-4" /> Digital Disaster Training Portal
        </div>
        <h1 className="text-3xl font-black text-slate-900">{t('trainingTitle')}</h1>
        <p className="text-xs text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Government-verified educational videos and safety protocols tailored for Himalayan & hill region communities.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input 
              type="text" 
              placeholder="Search safety topics, landslide rules, emergency kit setup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 outline-none cursor-pointer"
            >
              <option value="ALL">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Bengali">Bengali</option>
              <option value="Assamese">Assamese</option>
              <option value="Nepali">Nepali</option>
              <option value="Urdu">Urdu</option>
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 outline-none cursor-pointer"
            >
              <option value="ALL">All Hill States</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Assam">Assam</option>
              <option value="J&K">Jammu & Kashmir</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((v) => (
          <div 
            key={v.id} 
            onClick={() => setActiveVideo(v)}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {v.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-extrabold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full uppercase border border-cyan-200">
                    {v.category}
                  </span>
                  {v.isVerified && (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Govt Verified
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-cyan-700 transition-colors">
                  {v.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {v.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Language: <strong>{v.language}</strong></span>
              <span className="font-bold text-cyan-600 group-hover:underline flex items-center gap-1">
                Watch Video <PlayCircle className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Video className="w-4 h-4" /> Educational Resource: {activeVideo.id}
            </div>

            <h3 className="text-xl font-black">{activeVideo.title}</h3>

            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center relative">
              <div className="text-center p-6 space-y-3">
                <PlayCircle className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
                <p className="text-xs text-slate-400 max-w-md">
                  Official NDMA / SDMA Training Video Demo Player ({activeVideo.duration}). Educational content streamed securely from public safety servers.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {activeVideo.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
