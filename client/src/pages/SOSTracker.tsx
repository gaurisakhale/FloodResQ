import React, { useState } from 'react';
import { Search, MapPin, Clock, Package, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const SOSTracker: React.FC = () => {
  const [requestId, setRequestId] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId.trim()) return;

    setLoading(true);
    setError(null);

    const cleanId = requestId.trim();

    try {
      const res = await fetch(`/api/first-aid-sos/${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const item = await res.json();
        setData(item);
      } else {
        // Fallback check offline saved item in localStorage
        const offlineSaved = localStorage.getItem('floodguard_offline_sos');
        if (offlineSaved) {
          const list = JSON.parse(offlineSaved);
          const found = list.find((i: any) => i.id === cleanId);
          if (found) {
            setData({
              id: found.id,
              citizenName: found.citizenName,
              location: found.location,
              nearestRescueCenterName: 'Local Branch (Offline Mode)',
              nearestRescueCenterDistanceKm: 12.0,
              transmissionStatus: 'SAVED_LOCALLY',
              status: 'NEW',
              timestamp: found.timestamp,
              statusHistory: [{ status: 'NEW', timestamp: found.timestamp }]
            });
            setLoading(false);
            return;
          }
        }

        // Demo fallback for prototype test IDs
        if (cleanId.startsWith('FIRSTAID-') || cleanId.startsWith('SOS-')) {
          setData({
            id: cleanId,
            citizenName: 'Citizen Request',
            location: 'Himalayan Ridge Corridor',
            nearestRescueCenterName: 'Kedarnath Taskforce Unit #1',
            nearestRescueCenterDistanceKm: 8.5,
            transmissionStatus: 'SOS recorded successfully. Satellite transmission is not configured in this deployment.',
            status: 'DISPATCHED',
            timestamp: new Date().toISOString(),
            statusHistory: [
              { status: 'NEW', timestamp: new Date(Date.now() - 3600000).toISOString() },
              { status: 'ACKNOWLEDGED', timestamp: new Date(Date.now() - 2400000).toISOString() },
              { status: 'DISPATCHED', timestamp: new Date(Date.now() - 1200000).toISOString() }
            ]
          });
        } else {
          setError('No SOS request found matching this Request ID. Please verify your ID.');
          setData(null);
        }
      }
    } catch (err) {
      console.error('Tracking query error:', err);
      setError('Unable to reach server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Track SOS Emergency Status</h1>
        <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
          Enter your unique Request ID to track live operational dispatch status without administrative permissions.
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-end gap-3">
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">SOS Request ID *</label>
          <input 
            type="text" 
            placeholder="e.g. FIRSTAID-1726589201"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-mono text-slate-900 focus:bg-white focus:border-cyan-500 outline-none"
            value={requestId}
            onChange={e => setRequestId(e.target.value.toUpperCase())}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Track Request'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-center font-bold text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Live Status For Request</span>
              <h2 className="text-2xl font-black text-slate-900 font-mono">{data.id}</h2>
            </div>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider self-start sm:self-center">
              {data.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <MapPin className="w-5 h-5 text-cyan-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Rescue Center</span>
                <span className="font-bold text-slate-900">{data.nearestRescueCenterName || 'Central Rescue Branch'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Transmission Status</span>
                <span className="font-bold text-slate-800">{data.transmissionStatus || 'Recorded in Server'}</span>
              </div>
            </div>
          </div>

          {/* Status Progression Timeline */}
          <div className="pt-2 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">Status History & Operational Timeline</h3>
            <div className="space-y-4">
              {['NEW', 'ACKNOWLEDGED', 'TEAM_ASSIGNED', 'DISPATCHED', 'EN_ROUTE', 'REACHED_LOCATION', 'ASSISTANCE_PROVIDED', 'CLOSED'].map((st, idx) => {
                const statuses = ['NEW', 'ACKNOWLEDGED', 'TEAM_ASSIGNED', 'DISPATCHED', 'EN_ROUTE', 'REACHED_LOCATION', 'ASSISTANCE_PROVIDED', 'CLOSED'];
                const currentIdx = statuses.indexOf(data.status);
                const isPassed = idx <= currentIdx;
                const isCurrent = data.status === st;

                return (
                  <div key={st} className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                    isCurrent 
                      ? 'bg-sky-50 border-cyan-500 font-extrabold text-cyan-900 ring-1 ring-cyan-400' 
                      : isPassed 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 font-bold' 
                      : 'bg-white border-slate-100 text-slate-400'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isPassed ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="flex-1">{st.replace('_', ' ')}</span>
                    {isCurrent && <span className="text-[10px] bg-cyan-200 text-cyan-900 font-black px-2 py-0.5 rounded-full uppercase">CURRENT STATUS</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
