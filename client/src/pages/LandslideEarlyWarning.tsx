import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { RiskMeter } from '../components/RiskMeter';
import { Brain, Mountain, Droplets, AlertTriangle, Layers, Thermometer, Gauge, CheckCircle2 } from 'lucide-react';

export const LandslideEarlyWarning: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCorridor, setSelectedCorridor] = useState('Pithoragarh Highway Corridor (Uttarakhand)');

  const corridors: Record<string, {
    score: number;
    category: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'CRITICAL';
    confidence: string;
    factors: { label: string; value: string; impact: string }[];
    recommendation: string;
    lastUpdated: string;
    data: {
      soilSaturation: number;
      rainfallIntensity: number;
      cumulativeRainfall7d: number;
      previousRainfall24h: number;
      groundDisplacement: number;
      slopeAngle: number;
      soilType: string;
      elevation: number;
      temp: number;
      historicalIncidents: number;
      forecastRain3h: number;
      streamStatus: string;
    }
  }> = {
    'Pithoragarh Highway Corridor (Uttarakhand)': {
      score: 84,
      category: 'VERY HIGH',
      confidence: '78% Rule-Based Confidence',
      factors: [
        { label: 'High Soil Saturation', value: '90%', impact: '+25%' },
        { label: 'Heavy Antecedent Rainfall (7 Days)', value: '165 mm', impact: '+25%' },
        { label: 'Increasing InSAR Slope Displacement', value: '15 mm/yr', impact: '+20%' },
        { label: 'More Torrential Rainfall Forecast (Next 3h)', value: '45 mm', impact: '+14%' }
      ],
      recommendation: "Residents in officially designated vulnerable areas should remain prepared for evacuation and follow instructions from local disaster-management authorities.",
      lastUpdated: '10 mins ago',
      data: {
        soilSaturation: 90,
        rainfallIntensity: 18.5,
        cumulativeRainfall7d: 165,
        previousRainfall24h: 55,
        groundDisplacement: 15,
        slopeAngle: 38,
        soilType: 'Fissured Clay & Loose Schist',
        elevation: 1514,
        temp: 18,
        historicalIncidents: 12,
        forecastRain3h: 45,
        streamStatus: 'High Runoff / Swollen'
      }
    },
    'North Sikkim Ridge Zone (Sikkim)': {
      score: 94,
      category: 'CRITICAL',
      confidence: '82% Rule-Based Confidence',
      factors: [
        { label: 'Critical Soil Saturation', value: '95%', impact: '+25%' },
        { label: 'Extreme Cumulative 7-Day Rainfall', value: '210 mm', impact: '+25%' },
        { label: 'Rapid Ground Displacement Spike', value: '54 mm/yr', impact: '+20%' },
        { label: 'Steep Canyon Slope Angle', value: '44°', impact: '+24%' }
      ],
      recommendation: "Immediate alert: Evacuate low-lying structures directly below active landslide zone. Follow official Sikkim State Disaster Management Authority guidelines.",
      lastUpdated: '2 mins ago',
      data: {
        soilSaturation: 95,
        rainfallIntensity: 25.0,
        cumulativeRainfall7d: 210,
        previousRainfall24h: 72,
        groundDisplacement: 54,
        slopeAngle: 44,
        soilType: 'Unconsolidated Debris & Granite Moraine',
        elevation: 2700,
        temp: 14,
        historicalIncidents: 24,
        forecastRain3h: 65,
        streamStatus: 'Flooding River / High Erosion'
      }
    },
    'Ramban Highway Subsidence (J&K)': {
      score: 78,
      category: 'HIGH',
      confidence: '75% Rule-Based Confidence',
      factors: [
        { label: 'Rapid Active Road Slope Subsidence', value: '30 mm/yr', impact: '+20%' },
        { label: 'Moderate Soil Saturation', value: '65%', impact: '+25%' },
        { label: 'Cutting Slope Shear Stress', value: '35° Angle', impact: '+18%' },
        { label: 'Forecast Weather Rain', value: '20 mm', impact: '+15%' }
      ],
      recommendation: "Drive with extreme caution along National Highway. Avoid night travel during rain spells. Follow J&K Traffic & Disaster Authority updates.",
      lastUpdated: '15 mins ago',
      data: {
        soilSaturation: 65,
        rainfallIntensity: 12.0,
        cumulativeRainfall7d: 85,
        previousRainfall24h: 20,
        groundDisplacement: 30,
        slopeAngle: 35,
        soilType: 'Weathered Sandstone & Mudstone',
        elevation: 1156,
        temp: 20,
        historicalIncidents: 18,
        forecastRain3h: 20,
        streamStatus: 'Moderate Runoff'
      }
    }
  };

  const current = corridors[selectedCorridor] || corridors['Pithoragarh Highway Corridor (Uttarakhand)'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Model Disclaimer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('landslideTitle')}</h1>
          <p className="text-slate-500 text-sm">Multi-factor Slope Stability & Early Warning Model</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="bg-white border border-slate-200 text-sm font-bold text-slate-800 rounded-xl px-3 py-2 outline-none shadow-sm cursor-pointer"
          >
            {Object.keys(corridors).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <DataSourceBadge status="RULE_BASED" confidence={current.confidence} lastUpdated={current.lastUpdated} />
        </div>
      </div>

      {/* Transparent AI / Rule Engine Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Brain className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Transparency Notice:</strong> This module is powered by a transparent <strong>Rule-Based Demo Engine</strong> combining normalized terrain, rainfall, and displacement metrics. It is ready to plug into a validated ML inference API.
          </span>
        </div>
        <span className="font-extrabold bg-amber-200/80 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shrink-0 ml-2">DEMO ENGINE</span>
      </div>

      {/* Main Score & Recommendation Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Score & Meter */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Landslide Risk Score</span>
          <div className="relative flex items-center justify-center">
            <span className={`text-6xl font-black ${current.category === 'CRITICAL' ? 'text-rose-700' : current.category === 'VERY HIGH' ? 'text-red-600' : 'text-amber-600'}`}>
              {current.score}
            </span>
            <span className="text-xl font-bold text-slate-400 ml-1">/100</span>
          </div>
          <RiskMeter level={current.category} size="md" />
          <span className="text-[11px] text-slate-400 font-semibold">{current.confidence}</span>
        </div>

        {/* Contributing Factors & Recommendation */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">Main Contributing Factors:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {current.factors.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{f.label}:</span>
                  </div>
                  <span className="font-extrabold text-red-600">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-1">
            <h4 className="font-extrabold text-red-900 text-xs uppercase tracking-wider">Actionable Recommendation:</h4>
            <p className="text-xs text-red-800 font-semibold leading-relaxed">
              "{current.recommendation}"
            </p>
          </div>
        </div>
      </div>

      {/* Full 12-Factor Telemetry Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">Multi-Parameter Telemetry Input Matrix</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Soil Saturation</span>
            <span className="text-sm font-black text-slate-900">{current.data.soilSaturation}%</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Rain Intensity</span>
            <span className="text-sm font-black text-slate-900">{current.data.rainfallIntensity} mm/h</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Cumulative 7-Day</span>
            <span className="text-sm font-black text-slate-900">{current.data.cumulativeRainfall7d} mm</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">InSAR Displacement</span>
            <span className="text-sm font-black text-rose-600">+{current.data.groundDisplacement} mm/yr</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Slope Angle</span>
            <span className="text-sm font-black text-slate-900">{current.data.slopeAngle}°</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Forecast 3h Rain</span>
            <span className="text-sm font-black text-sky-600">{current.data.forecastRain3h} mm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-100">
          <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Geology / Soil Type:</span>
            <span className="font-bold text-slate-800">{current.data.soilType}</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Elevation:</span>
            <span className="font-bold text-slate-800">{current.data.elevation} m</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Historical Landslides:</span>
            <span className="font-bold text-slate-800">{current.data.historicalIncidents} Recorded</span>
          </div>
        </div>
      </div>
    </div>
  );
};
