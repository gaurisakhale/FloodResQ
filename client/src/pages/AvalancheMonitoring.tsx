import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { RiskMeter } from '../components/RiskMeter';
import { Snowflake, Wind, Thermometer, Radar, AlertTriangle, Compass, Eye, ShieldAlert } from 'lucide-react';

export const AvalancheMonitoring: React.FC = () => {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('Kedarnath Upper Ridge (Uttarakhand)');

  const regionsData: Record<string, {
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'EXTREME';
    snowAccumulationCm: number;
    tempC: number;
    windSpeedKmH: number;
    windDirection: string;
    recentSnowfall24hCm: number;
    slopeAngle: number;
    slopeStatus: string;
    snowpackStability: string;
    radarStatus: string;
    lastUpdate: string;
    elevation: number;
  }> = {
    'Kedarnath Upper Ridge (Uttarakhand)': {
      riskLevel: 'VERY HIGH',
      snowAccumulationCm: 145,
      tempC: -6,
      windSpeedKmH: 42,
      windDirection: 'NW',
      recentSnowfall24hCm: 35,
      slopeAngle: 38,
      slopeStatus: 'CRITICAL INSTABILITY',
      snowpackStability: 'Weak Slab Layer Over Hard Crust',
      radarStatus: 'Awaiting Live Radar Integration',
      lastUpdate: '15 mins ago',
      elevation: 4100
    },
    'Lahaul & Spiti Pass (Himachal Pradesh)': {
      riskLevel: 'EXTREME',
      snowAccumulationCm: 210,
      tempC: -10,
      windSpeedKmH: 58,
      windDirection: 'N',
      recentSnowfall24hCm: 55,
      slopeAngle: 42,
      slopeStatus: 'ACTIVE SLAB DISPLACEMENT',
      snowpackStability: 'Extremely Fragile Depth Hoar',
      radarStatus: 'Awaiting Live Radar Integration',
      lastUpdate: '5 mins ago',
      elevation: 3900
    },
    'North Sikkim Alpine Plateau (Sikkim)': {
      riskLevel: 'HIGH',
      snowAccumulationCm: 110,
      tempC: -4,
      windSpeedKmH: 30,
      windDirection: 'NE',
      recentSnowfall24hCm: 20,
      slopeAngle: 34,
      slopeStatus: 'MODERATE SLAB RISK',
      snowpackStability: 'Compacted Wind Slab',
      radarStatus: 'Awaiting Live Radar Integration',
      lastUpdate: '30 mins ago',
      elevation: 4300
    }
  };

  const current = regionsData[selectedRegion] || regionsData['Kedarnath Upper Ridge (Uttarakhand)'];

  return (
    <div className="space-y-6 pb-12">
      {/* Integration Notice Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Radar className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <h2 className="font-extrabold text-sm tracking-wide text-cyan-300">DEMO — AWAITING LIVE RADAR INTEGRATION</h2>
            <p className="text-xs text-slate-400">Snowpack telemetry and avalanche radar feed architecture ready for CWC/SASE telemetry hookup.</p>
          </div>
        </div>
        <DataSourceBadge status="DEMO" lastUpdated={current.lastUpdate} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('avalancheTitle')}</h1>
          <p className="text-slate-500 text-sm">Himalayan Alpine Avalanche & Snowpack Radar Monitoring</p>
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-white border border-slate-200 text-sm font-bold text-slate-800 rounded-xl px-3 py-2 outline-none shadow-sm cursor-pointer"
        >
          {Object.keys(regionsData).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Main Status Display */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Monitored Corridor</span>
            <h2 className="text-xl font-black text-slate-900">{selectedRegion}</h2>
            <p className="text-xs text-slate-500 font-semibold">Elevation: {current.elevation} m | Slope Angle: {current.slopeAngle}°</p>
          </div>

          <div className="flex items-center gap-3">
            <RiskMeter level={current.riskLevel} size="md" />
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase"><Snowflake className="w-4 h-4 text-sky-500" /> Snow Accum.</span>
            <span className="text-2xl font-black text-slate-900">{current.snowAccumulationCm} cm</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase"><Thermometer className="w-4 h-4 text-rose-500" /> Temperature</span>
            <span className="text-2xl font-black text-slate-900">{current.tempC} °C</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase"><Wind className="w-4 h-4 text-slate-500" /> Wind Speed</span>
            <span className="text-2xl font-black text-slate-900">{current.windSpeedKmH} km/h {current.windDirection}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase"><Snowflake className="w-4 h-4 text-sky-400" /> 24h Snowfall</span>
            <span className="text-2xl font-black text-sky-600">+{current.recentSnowfall24hCm} cm</span>
          </div>
        </div>

        {/* Snowpack Stability & Safety Advisory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-1 text-xs text-amber-900">
            <span className="font-extrabold uppercase text-[11px] text-amber-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Snowpack Stability Analysis:
            </span>
            <p className="font-bold text-slate-800">{current.snowpackStability}</p>
            <p className="text-slate-600">Slope Status: <strong>{current.slopeStatus}</strong></p>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
            <span className="font-extrabold uppercase text-[11px] text-cyan-400 flex items-center gap-1.5">
              <Radar className="w-4 h-4 text-cyan-400" /> Radar Integration Sensor Status:
            </span>
            <p className="text-slate-300 font-mono text-[11px]">{current.radarStatus}</p>
            <p className="text-slate-400 text-[10px]">Adapter Service: AvalancheRadarAdapter (Ready for SASE telemetry)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
