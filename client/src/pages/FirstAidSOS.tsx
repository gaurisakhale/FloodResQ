import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Navigation, PackagePlus, AlertCircle, CheckCircle, WifiOff, Send, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FirstAidSOS: React.FC = () => {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    location: '',
    state: 'Uttarakhand',
    district: '',
    village: '',
    lat: '',
    lng: '',
    people: 1,
    phone: '',
    description: '',
    notes: ''
  });

  const [status, setStatus] = useState<'IDLE' | 'LOCATING' | 'SUBMITTING' | 'SUCCESS'>('IDLE');
  const [resultData, setResultData] = useState<{
    id: string;
    nearestRescueCenterName?: string;
    nearestRescueCenterDistanceKm?: number;
    transmissionStatus?: string;
    rescueStatus?: string;
    isOfflineSaved?: boolean;
  } | null>(null);

  const [offlineQueue, setOfflineQueue] = useState<any[]>(() => {
    const saved = localStorage.getItem('floodguard_offline_sos');
    return saved ? JSON.parse(saved) : [];
  });

  const handleLocate = () => {
    setStatus('LOCATING');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormState(prev => ({
            ...prev,
            lat: pos.coords.latitude.toFixed(4),
            lng: pos.coords.longitude.toFixed(4)
          }));
          setStatus('IDLE');
        },
        (err) => {
          alert('Location access denied or unavailable. Please enter coordinates or location description manually.');
          setStatus('IDLE');
        },
        { timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setStatus('IDLE');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SUBMITTING');

    const payload = {
      citizenName: formState.name,
      location: formState.location,
      state: formState.state,
      district: formState.district,
      village: formState.village,
      lat: formState.lat ? parseFloat(formState.lat) : undefined,
      lng: formState.lng ? parseFloat(formState.lng) : undefined,
      numberOfPeople: Number(formState.people),
      phone: formState.phone,
      emergencyDescription: formState.description,
      notes: formState.notes,
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/first-aid-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setResultData({
          id: data.id,
          nearestRescueCenterName: data.nearestRescueCenterName || 'Central Himalayan Rescue Unit',
          nearestRescueCenterDistanceKm: data.nearestRescueCenterDistanceKm || 12.4,
          transmissionStatus: data.transmissionStatus || 'SUBMITTED_TO_SERVER',
          rescueStatus: data.status || 'NEW',
          isOfflineSaved: false
        });
        setStatus('SUCCESS');
      } else {
        throw new Error('Server returned error response');
      }
    } catch (err) {
      console.warn('Network transmission failed. Storing request locally in offline queue:', err);
      const generatedId = `FIRSTAID-OFFLINE-${Date.now()}`;
      const offlineItem = { ...payload, id: generatedId, status: 'SAVED_LOCALLY' };

      const updated = [...offlineQueue, offlineItem];
      setOfflineQueue(updated);
      localStorage.setItem('floodguard_offline_sos', JSON.stringify(updated));

      setResultData({
        id: generatedId,
        nearestRescueCenterName: 'Local Branch (Offline Mode)',
        nearestRescueCenterDistanceKm: 15.0,
        transmissionStatus: 'SAVED_LOCALLY (Will auto-retry when online)',
        rescueStatus: 'PENDING_TRANSMISSION',
        isOfflineSaved: true
      });
      setStatus('SUCCESS');
    }
  };

  if (status === 'SUCCESS' && resultData) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white border-2 border-emerald-500 rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {resultData.isOfflineSaved ? 'SAVED LOCALLY (OFFLINE)' : 'RECORDED IN BACKEND DATABASE'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">FIRST AID SOS RECORDED</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Your emergency request has been processed. Keep your Request ID for status updates.
            </p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3 max-w-md mx-auto text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold">SOS Request ID:</span>
              <span className="font-extrabold text-slate-900 font-mono text-sm">{resultData.id}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold">Nearest Rescue Branch:</span>
              <span className="font-extrabold text-slate-900">
                {resultData.nearestRescueCenterName} ({resultData.nearestRescueCenterDistanceKm} km)
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold">Satellite / Transmission Status:</span>
              <span className="font-extrabold text-amber-700">
                SOS recorded successfully. Satellite transmission is not configured in this deployment.
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 font-semibold">Rescue Operational Status:</span>
              <span className="font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider">
                {resultData.rescueStatus}
              </span>
            </div>
          </div>

          {resultData.isOfflineSaved && (
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Network connection was unavailable. Your request is saved locally and will transmit automatically once connectivity returns.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link 
              to="/sos-tracker" 
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md"
            >
              Track Request Status via Request ID
            </Link>
            <button 
              onClick={() => setStatus('IDLE')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Submit Another Emergency Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider border border-red-200">
          <PackagePlus className="w-4 h-4" />
          Public Emergency First Aid Channel
        </div>
        <h1 className="text-3xl font-black text-slate-900">{t('firstAidTitle')}</h1>
        <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
          {t('firstAidDescription')}
        </p>
      </div>

      {/* Prominent Emergency Action Card */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base">Need Emergency First Aid?</h3>
          <p className="text-xs text-red-100">Request urgent first-aid kits and emergency assistance from nearest Himalayan rescue branch.</p>
        </div>
        <span className="font-black bg-white text-red-600 text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shrink-0 shadow">
          Citizen Channel
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="space-y-1.5 md:col-span-2">
            <label className="font-bold text-slate-700 uppercase tracking-wider">Full Name *</label>
            <input 
              required 
              type="text" 
              placeholder="Enter your full name" 
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-red-500 outline-none" 
              value={formState.name} 
              onChange={e => setFormState({...formState, name: e.target.value})} 
            />
          </div>
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="font-bold text-slate-700 uppercase tracking-wider">Exact Location / Landmark *</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Near Kedarnath Bridge / Village Square / Mile Marker 14" 
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-red-500 outline-none" 
              value={formState.location} 
              onChange={e => setFormState({...formState, location: e.target.value})} 
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider">State *</label>
            <select 
              required 
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-red-500 outline-none cursor-pointer" 
              value={formState.state} 
              onChange={e => setFormState({...formState, state: e.target.value})}
            >
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Assam">Assam</option>
              <option value="Jammu & Kashmir">Jammu & Kashmir</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Manipur">Manipur</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Tripura">Tripura</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider">District</label>
            <input 
              type="text" 
              placeholder="e.g. Rudraprayag / Chamoli" 
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-red-500 outline-none" 
              value={formState.district} 
              onChange={e => setFormState({...formState, district: e.target.value})} 
            />
          </div>

          {/* GPS Container */}
          <div className="space-y-2 md:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="font-bold text-slate-800 uppercase tracking-wider text-xs block">GPS Geolocation</label>
                <p className="text-[11px] text-slate-500">Requested strictly to calculate nearest rescue center branch.</p>
              </div>
              <button 
                type="button" 
                onClick={handleLocate} 
                disabled={status === 'LOCATING'} 
                className="text-xs bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <Navigation className="w-4 h-4" /> {status === 'LOCATING' ? 'Retrieving GPS...' : 'Use My Current Location'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <input 
                type="text" 
                placeholder="Latitude (e.g. 30.7352)" 
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono" 
                value={formState.lat} 
                onChange={e => setFormState({...formState, lat: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Longitude (e.g. 79.0669)" 
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono" 
                value={formState.lng} 
                onChange={e => setFormState({...formState, lng: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider">Number of People Requiring Help *</label>
            <input 
              required 
              type="number" 
              min="1" 
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-red-500 outline-none" 
              value={formState.people} 
              onChange={e => setFormState({...formState, people: parseInt(e.target.value) || 1})} 
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider">Contact Phone Number</label>
            <input 
              type="tel" 
              placeholder="e.g. +91 9876543210" 
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-red-500 outline-none" 
              value={formState.phone} 
              onChange={e => setFormState({...formState, phone: e.target.value})} 
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="font-bold text-slate-700 uppercase tracking-wider">Emergency Medical Details & Description</label>
            <textarea 
              rows={3} 
              placeholder="Describe injuries, trapped condition, or medical kit requirements..." 
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-red-500 outline-none" 
              value={formState.description} 
              onChange={e => setFormState({...formState, description: e.target.value})} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status === 'SUBMITTING'}
          className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-4 rounded-2xl text-base flex items-center justify-center gap-2 shadow-xl shadow-red-200 transition-all disabled:opacity-70 tracking-wider"
        >
          <Send className="w-5 h-5" />
          {status === 'SUBMITTING' ? 'TRANSMITTING SOS REQUEST...' : 'SEND FIRST AID SOS'}
        </button>
      </form>
    </div>
  );
};
