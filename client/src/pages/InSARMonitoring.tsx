import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { Satellite, AlertTriangle, Info, MapPin, TrendingUp, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const InSARMonitoring: React.FC = () => {
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const insarData = [
    {
      id: 'INSAR-01',
      region: 'Kedarnath Slopes & Slope Corridor',
      state: 'Uttarakhand',
      district: 'Rudraprayag',
      lat: 30.7352,
      lng: 79.0669,
      displacementMmYr: 48.5,
      previousDisplacementMm: 35.2,
      currentDisplacementMm: 48.5,
      displacementTrend: 'RAPID_ACCELERATION',
      observationPeriod: '2025-09-01 to 2026-09-15',
      slopeMovementStatus: 'Critical Movement',
      riskCategory: 'CRITICAL',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'INSAR-02',
      region: 'Joshimath / Chamoli Unstable Ridge',
      state: 'Uttarakhand',
      district: 'Chamoli',
      lat: 30.556,
      lng: 79.566,
      displacementMmYr: 32.1,
      previousDisplacementMm: 24.0,
      currentDisplacementMm: 32.1,
      displacementTrend: 'STEADY_ACCELERATION',
      observationPeriod: '2025-09-01 to 2026-09-15',
      slopeMovementStatus: 'Rapid Movement',
      riskCategory: 'VERY HIGH',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'INSAR-03',
      region: 'North Sikkim Teesta Valley Ridge',
      state: 'Sikkim',
      district: 'Mangan',
      lat: 27.733,
      lng: 88.516,
      displacementMmYr: 54.0,
      previousDisplacementMm: 40.5,
      currentDisplacementMm: 54.0,
      displacementTrend: 'EXPONENTIAL_SPIKE',
      observationPeriod: '2025-09-01 to 2026-09-15',
      slopeMovementStatus: 'Critical Movement',
      riskCategory: 'CRITICAL',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'INSAR-04',
      region: 'Ramban Highway Subsidence Corridor',
      state: 'J&K',
      district: 'Ramban',
      lat: 33.233,
      lng: 75.233,
      displacementMmYr: 28.4,
      previousDisplacementMm: 20.1,
      currentDisplacementMm: 28.4,
      displacementTrend: 'MODERATE_ACCELERATION',
      observationPeriod: '2025-09-01 to 2026-09-15',
      slopeMovementStatus: 'Moderate Movement',
      riskCategory: 'HIGH',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'INSAR-05',
      region: 'Dima Hasao Hill Cut Slope',
      state: 'Assam',
      district: 'Dima Hasao',
      lat: 25.183,
      lng: 93.016,
      displacementMmYr: 42.0,
      previousDisplacementMm: 31.0,
      currentDisplacementMm: 42.0,
      displacementTrend: 'RAPID_ACCELERATION',
      observationPeriod: '2025-09-01 to 2026-09-15',
      slopeMovementStatus: 'Critical Movement',
      riskCategory: 'CRITICAL',
      timestamp: new Date().toISOString(),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical Movement': return '#e11d48';
      case 'Rapid Movement': return '#ef4444';
      case 'Moderate Movement': return '#f59e0b';
      case 'Minor Movement': return '#eab308';
      default: return '#10b981';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Demo Warning Banner */}
      <div className="bg-orange-50 border-2 border-orange-400 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-600 animate-pulse shrink-0" />
          <div>
            <h2 className="font-extrabold text-orange-900 text-sm tracking-wide">DEMO DATA — NOT FOR OPERATIONAL EMERGENCY USE</h2>
            <p className="text-xs text-orange-700">InSAR ground displacement telemetry modeled after Uttarakhand & Himalayan satellite pilot studies.</p>
          </div>
        </div>
        <DataSourceBadge status="DEMO" />
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">{t('inSARTitle')}</h1>
        <p className="text-slate-500 text-sm">Interferometric Synthetic Aperture Radar (Sentinel-1 / NISAR) Slope Stability Monitoring</p>
      </div>

      {/* Map Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden space-y-2 p-2">
        <div className="h-96 w-full rounded-xl overflow-hidden relative z-0">
          <MapContainer center={[30.0, 80.0]} zoom={6} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {insarData.map((d) => (
              <CircleMarker
                key={d.id}
                center={[d.lat, d.lng]}
                radius={d.displacementMmYr > 40 ? 14 : 10}
                pathOptions={{
                  fillColor: getStatusColor(d.slopeMovementStatus),
                  fillOpacity: 0.8,
                  color: '#ffffff',
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSelectedZone(d.region),
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs font-sans">
                    <strong className="text-slate-900 text-sm block">{d.region}</strong>
                    <div className="text-slate-600">Displacement: <span className="font-bold text-red-600">+{d.displacementMmYr} mm/yr</span></div>
                    <div className="text-slate-600">Status: <span className="font-bold">{d.slopeMovementStatus}</span></div>
                    <div className="text-slate-500 text-[10px]">Lat/Lng: {d.lat}, {d.lng}</div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-cyan-600" />
            <span><strong>InSAR Adapter Status:</strong> Swappable API architecture (OpenTopography / Sentinel-1 / NISAR API placeholder).</span>
          </div>
          <span className="font-bold text-slate-700">Observation Period: 2025–2026</span>
        </div>
      </div>

      {/* Detailed Displacement Telemetry Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-600" />
            <span>Himalayan Slope Ground Displacement Observations</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">Total Monitored Slope Corridors: {insarData.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Region / Slope</th>
                <th className="p-3.5">District & State</th>
                <th className="p-3.5">Latitude / Longitude</th>
                <th className="p-3.5">Previous (mm)</th>
                <th className="p-3.5">Current (mm)</th>
                <th className="p-3.5">Displacement (mm/yr)</th>
                <th className="p-3.5">Slope Movement Status</th>
                <th className="p-3.5">Risk Level</th>
                <th className="p-3.5">Data Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {insarData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{row.region}</td>
                  <td className="p-3.5 font-semibold text-slate-600">{row.district}, {row.state}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">{row.lat.toFixed(4)}, {row.lng.toFixed(4)}</td>
                  <td className="p-3.5 font-mono text-slate-600">+{row.previousDisplacementMm} mm</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">+{row.currentDisplacementMm} mm</td>
                  <td className="p-3.5 font-black text-rose-600 font-mono text-sm">+{row.displacementMmYr} mm/yr</td>
                  <td className="p-3.5">
                    <span 
                      className="px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider text-white"
                      style={{ backgroundColor: getStatusColor(row.slopeMovementStatus) }}
                    >
                      {row.slopeMovementStatus}
                    </span>
                  </td>
                  <td className="p-3.5 font-black text-xs text-red-600">{row.riskCategory}</td>
                  <td className="p-3.5 text-slate-400 text-[11px] font-mono">Just now</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
