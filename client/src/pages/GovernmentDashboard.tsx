import React, { useState } from 'react';
import { Shield, Activity, Users, AlertTriangle, Filter, MapPin, Layers, Calendar, BarChart3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const GovernmentDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('ALL');
  const [selectedDisasterType, setSelectedDisasterType] = useState('ALL');

  const districtData = [
    { district: 'Rudraprayag', state: 'Uttarakhand', flashFlood: 'VERY HIGH', landslide: 'HIGH', avalanche: 'MODERATE', soilSaturation: '88%', activeSos: 24, teams: 8, firstAidKits: 145, status: 'HIGH_ALERT' },
    { district: 'Chamoli', state: 'Uttarakhand', flashFlood: 'MODERATE', landslide: 'MODERATE', avalanche: 'LOW', soilSaturation: '60%', activeSos: 5, teams: 4, firstAidKits: 80, status: 'STABLE' },
    { district: 'Mangan (North Sikkim)', state: 'Sikkim', flashFlood: 'CRITICAL', landslide: 'CRITICAL', avalanche: 'HIGH', soilSaturation: '95%', activeSos: 38, teams: 12, firstAidKits: 210, status: 'EMERGENCY' },
    { district: 'Lahaul & Spiti', state: 'Himachal Pradesh', flashFlood: 'LOW', landslide: 'MODERATE', avalanche: 'EXTREME', soilSaturation: '40%', activeSos: 3, teams: 2, firstAidKits: 45, status: 'AVALANCHE_WARNING' },
    { district: 'Dima Hasao', state: 'Assam', flashFlood: 'HIGH', landslide: 'CRITICAL', avalanche: 'LOW', soilSaturation: '92%', activeSos: 18, teams: 6, firstAidKits: 110, status: 'HIGH_ALERT' },
    { district: 'Ramban', state: 'J&K', flashFlood: 'MODERATE', landslide: 'VERY HIGH', avalanche: 'LOW', soilSaturation: '65%', activeSos: 12, teams: 5, firstAidKits: 90, status: 'MONITORING' },
  ];

  const filteredDistricts = districtData.filter(item => {
    if (selectedState !== 'ALL' && item.state !== selectedState) return false;
    if (selectedDistrict !== 'ALL' && item.district !== selectedDistrict) return false;
    if (selectedRiskLevel !== 'ALL' && item.flashFlood !== selectedRiskLevel && item.landslide !== selectedRiskLevel && item.avalanche !== selectedRiskLevel) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Government Operations & Multi-State Command Dashboard</h1>
          <p className="text-slate-500 text-sm">NDMA / SDMA / CWC High-Level Disaster Monitoring & Resource Allocation</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shrink-0">
          <Shield className="w-4 h-4 text-amber-400" /> CWC & NDMA Authorized Executive Console
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-extrabold uppercase">
          <Filter className="w-4 h-4 text-cyan-600" /> Executive Filters:
        </div>

        <select 
          value={selectedState} 
          onChange={e => setSelectedState(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none cursor-pointer"
        >
          <option value="ALL">All States (12 Hill States)</option>
          <option value="Uttarakhand">Uttarakhand</option>
          <option value="Himachal Pradesh">Himachal Pradesh</option>
          <option value="Sikkim">Sikkim</option>
          <option value="Assam">Assam</option>
          <option value="J&K">Jammu & Kashmir</option>
        </select>

        <select 
          value={selectedRiskLevel} 
          onChange={e => setSelectedRiskLevel(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none cursor-pointer"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="VERY HIGH">VERY HIGH</option>
          <option value="HIGH">HIGH</option>
          <option value="MODERATE">MODERATE</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 border-t-4 border-t-red-500 space-y-1">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active SOS Signals</div>
          <div className="text-3xl font-black text-slate-900">100</div>
          <p className="text-[11px] text-red-600 font-semibold">Includes 38 First Aid Kit SOS requests</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 border-t-4 border-t-rose-600 space-y-1">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Critical Risk Regions</div>
          <div className="text-3xl font-black text-rose-700">8 Regions</div>
          <p className="text-[11px] text-slate-500 font-semibold">High soil saturation (&gt;85%)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 border-t-4 border-t-cyan-500 space-y-1">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Taskforces Deployed</div>
          <div className="text-3xl font-black text-slate-900">37 Units</div>
          <p className="text-[11px] text-cyan-700 font-semibold">12 Available in reserve</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 border-t-4 border-t-emerald-500 space-y-1">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">First Aid Dispatched</div>
          <div className="text-3xl font-black text-slate-900">680 Kits</div>
          <p className="text-[11px] text-emerald-700 font-semibold">Avg Response Time: 18 mins</p>
        </div>
      </div>

      {/* District Risk & Allocation Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-600" /> Multi-State District Risk & Resource Allocation
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-Time Data Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">District & State</th>
                <th className="p-3.5">Flash Flood Risk</th>
                <th className="p-3.5">Landslide Risk</th>
                <th className="p-3.5">Avalanche Risk</th>
                <th className="p-3.5">Soil Saturation</th>
                <th className="p-3.5">Active SOS</th>
                <th className="p-3.5">Deployed Units</th>
                <th className="p-3.5">First Aid Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredDistricts.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <div>{row.district}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.state}</div>
                  </td>
                  <td className="p-3.5 font-black text-xs">
                    <span className={row.flashFlood === 'CRITICAL' ? 'text-rose-700' : row.flashFlood === 'VERY HIGH' ? 'text-red-600' : 'text-amber-600'}>
                      {row.flashFlood}
                    </span>
                  </td>
                  <td className="p-3.5 font-black text-xs">
                    <span className={row.landslide === 'CRITICAL' ? 'text-rose-700' : row.landslide === 'HIGH' ? 'text-amber-600' : 'text-slate-700'}>
                      {row.landslide}
                    </span>
                  </td>
                  <td className="p-3.5 font-black text-xs text-slate-800">{row.avalanche}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">{row.soilSaturation}</td>
                  <td className="p-3.5 font-mono font-black text-red-600 text-sm">{row.activeSos}</td>
                  <td className="p-3.5 font-mono font-bold text-cyan-700">{row.teams}</td>
                  <td className="p-3.5 font-mono text-slate-700">{row.firstAidKits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
