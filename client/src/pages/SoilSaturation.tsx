import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { RiskMeter } from '../components/RiskMeter';
import { Droplets, Info, AlertTriangle, CloudRain, Layers, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const SoilSaturation: React.FC = () => {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('Kedarnath Valley');
  const [criticalThreshold, setCriticalThreshold] = useState(85);

  const regionsData: Record<string, {
    saturation: number;
    rainfall: number;
    waterRetention: number;
    slopeRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'CRITICAL';
    landslideCorr: number;
    lastUpdate: string;
    history: { time: string; saturation: number; rainfall: number }[];
  }> = {
    'Kedarnath Valley': {
      saturation: 88,
      rainfall: 55,
      waterRetention: 42,
      slopeRisk: 'VERY HIGH',
      landslideCorr: 92,
      lastUpdate: '5 mins ago',
      history: [
        { time: '00:00', saturation: 60, rainfall: 10 },
        { time: '04:00', saturation: 68, rainfall: 18 },
        { time: '08:00', saturation: 75, rainfall: 32 },
        { time: '12:00', saturation: 82, rainfall: 45 },
        { time: '16:00', saturation: 88, rainfall: 55 },
      ]
    },
    'North Sikkim': {
      saturation: 94,
      rainfall: 72,
      waterRetention: 48,
      slopeRisk: 'CRITICAL',
      landslideCorr: 96,
      lastUpdate: '2 mins ago',
      history: [
        { time: '00:00', saturation: 70, rainfall: 15 },
        { time: '04:00', saturation: 78, rainfall: 28 },
        { time: '08:00', saturation: 85, rainfall: 48 },
        { time: '12:00', saturation: 90, rainfall: 62 },
        { time: '16:00', saturation: 94, rainfall: 72 },
      ]
    },
    'Shillong': {
      saturation: 85,
      rainfall: 65,
      waterRetention: 38,
      slopeRisk: 'HIGH',
      landslideCorr: 89,
      lastUpdate: '8 mins ago',
      history: [
        { time: '00:00', saturation: 55, rainfall: 12 },
        { time: '04:00', saturation: 65, rainfall: 25 },
        { time: '08:00', saturation: 74, rainfall: 40 },
        { time: '12:00', saturation: 81, rainfall: 55 },
        { time: '16:00', saturation: 85, rainfall: 65 },
      ]
    },
    'Dima Hasao': {
      saturation: 91,
      rainfall: 68,
      waterRetention: 45,
      slopeRisk: 'CRITICAL',
      landslideCorr: 94,
      lastUpdate: '10 mins ago',
      history: [
        { time: '00:00', saturation: 68, rainfall: 20 },
        { time: '04:00', saturation: 75, rainfall: 35 },
        { time: '08:00', saturation: 82, rainfall: 50 },
        { time: '12:00', saturation: 88, rainfall: 60 },
        { time: '16:00', saturation: 91, rainfall: 68 },
      ]
    }
  };

  const currentData = regionsData[selectedRegion] || regionsData['Kedarnath Valley'];
  
  const getStatus = (val: number) => {
    if (val <= 30) return { text: 'LOW', color: 'text-emerald-600', border: 'border-emerald-500' };
    if (val <= 50) return { text: 'MODERATE', color: 'text-yellow-600', border: 'border-yellow-500' };
    if (val <= 70) return { text: 'HIGH', color: 'text-amber-600', border: 'border-amber-500' };
    if (val <= 85) return { text: 'VERY HIGH', color: 'text-red-600', border: 'border-red-500' };
    return { text: 'CRITICAL', color: 'text-rose-700', border: 'border-rose-700' };
  };

  const statusObj = getStatus(currentData.saturation);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('soilSaturationTitle')}</h1>
          <p className="text-slate-500 text-sm">Real-time Soil Saturation, Estimated Water Retention & Landslide Correlation</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-xl shadow-sm">
            <Layers className="w-4 h-4 text-cyan-600" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
            >
              {Object.keys(regionsData).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <DataSourceBadge status="SATELLITE" lastUpdated={currentData.lastUpdate} />
        </div>
      </div>

      {/* Warning Banner if Soil Saturation High */}
      {currentData.saturation >= 75 && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 flex items-start gap-3 shadow-md animate-pulse">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-red-800 text-sm">DANGER: HIGH SOIL SATURATION LEVEL</h3>
            <p className="text-xs text-red-700 font-semibold leading-relaxed">
              "Soil saturation is approaching a dangerous level ({currentData.saturation}%). Landslide and slope failure probability may increase. Follow official evacuation guidance."
            </p>
          </div>
        </div>
      )}

      {/* Configurable Threshold Notice */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm">Configurable Regional Saturation Bands</h3>
          </div>
          <span className="text-xs text-slate-400">Government & Geology Operational Guidelines</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <span className="text-emerald-400 font-bold block">0 – 30%</span>
            <span className="text-slate-400 text-[10px]">LOW</span>
          </div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <span className="text-yellow-400 font-bold block">31 – 50%</span>
            <span className="text-slate-400 text-[10px]">MODERATE</span>
          </div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-bold block">51 – 70%</span>
            <span className="text-slate-400 text-[10px]">HIGH</span>
          </div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <span className="text-red-400 font-bold block">71 – 85%</span>
            <span className="text-slate-400 text-[10px]">VERY HIGH</span>
          </div>
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <span className="text-rose-500 font-bold block">86 – 100%</span>
            <span className="text-slate-400 text-[10px]">CRITICAL</span>
          </div>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge & Main Metrics */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 flex flex-col items-center justify-between space-y-6">
          <h3 className="font-bold text-slate-800 self-start border-b border-slate-100 pb-2 w-full flex items-center justify-between">
            <span>{selectedRegion} Gauge</span>
            <span className="text-xs font-semibold text-slate-400">Sensor ID: SAT-994</span>
          </h3>

          <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-100 flex items-center justify-center">
            <div 
              className={`absolute inset-0 rounded-full border-[16px] ${statusObj.border}`} 
              style={{ clipPath: `polygon(0 0, 100% 0, 100% ${currentData.saturation}%, 0 ${currentData.saturation}%)` }} 
            />
            <div className="text-center z-10 bg-white w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-inner">
              <span className="text-4xl font-black text-slate-900">{currentData.saturation}%</span>
              <span className={`text-xs font-black uppercase ${statusObj.color}`}>{statusObj.text}</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 text-center">
            <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Recent Rainfall</p>
              <p className="text-lg font-black text-sky-700">{currentData.rainfall} mm</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Water Retention</p>
              <p className="text-lg font-black text-amber-700">{currentData.waterRetention} mm</p>
            </div>
          </div>

          <div className="w-full pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-600">Landslide Correlation:</span>
            <span className="font-black text-red-600">{currentData.landslideCorr}%</span>
          </div>
        </div>

        {/* Historical Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-md p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">24-Hour Soil Saturation Trend</h3>
              <p className="text-xs text-slate-400">Telemetry history & rainfall accumulation correlation</p>
            </div>
            <Activity className="w-5 h-5 text-cyan-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="saturation" name="Soil Saturation (%)" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#0284c7" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 italic">
            <strong>Geological Disclaimer:</strong> High soil saturation significantly increases pore water pressure on slopes. However, soil saturation alone does not guarantee a landslide will occur; slope angle, fault lines, and vegetation cover are also key factors.
          </div>
        </div>
      </div>
    </div>
  );
};
