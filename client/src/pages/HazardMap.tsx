import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import { Layers, MapPin, AlertTriangle, ShieldPlus, Activity, CloudRain, Droplets, Wind, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export const HazardMap: React.FC = () => {
  const { t } = useLanguage();
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    'Flash Flood Risk': true,
    'Landslide Risk': true,
    'Soil Saturation': true,
    'InSAR Ground Movement': true,
    'Avalanche Risk': true,
    'Rainfall': false,
    'Rivers/Streams': true,
    'Rescue Centers': true,
    'Shelters': true,
    'Hospitals': false,
    'First Aid Points': true,
    'Safe Zones': true,
    'Evacuation Routes': true,
  });

  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const layersList = [
    'Flash Flood Risk', 'Landslide Risk', 'Soil Saturation', 'InSAR Ground Movement',
    'Avalanche Risk', 'Rainfall', 'Rivers/Streams', 'Rescue Centers',
    'Shelters', 'Hospitals', 'First Aid Points', 'Safe Zones', 'Evacuation Routes'
  ];

  const mapRegions = [
    {
      id: 'REG-01',
      name: 'Kedarnath Valley',
      district: 'Rudraprayag',
      state: 'Uttarakhand',
      lat: 30.7352,
      lng: 79.0669,
      flashFloodRisk: 'VERY HIGH',
      landslideRisk: 'HIGH',
      avalancheRisk: 'MODERATE',
      soilSaturation: 88,
      weatherCondition: 'Heavy Downpour (18mm/h)',
      recommendedAction: 'Move to higher ground immediately. Avoid river funnels.',
      lastUpdated: '10 mins ago',
    },
    {
      id: 'REG-02',
      name: 'North Sikkim Teesta Basin',
      district: 'Mangan',
      state: 'Sikkim',
      lat: 27.733,
      lng: 88.516,
      flashFloodRisk: 'CRITICAL',
      landslideRisk: 'CRITICAL',
      avalancheRisk: 'HIGH',
      soilSaturation: 95,
      weatherCondition: 'Torrential Peak Rain',
      recommendedAction: 'Evacuate designated flood plain and active debris slopes immediately.',
      lastUpdated: '2 mins ago',
    },
    {
      id: 'REG-03',
      name: 'Lahaul & Spiti High Pass',
      district: 'Lahaul and Spiti',
      state: 'Himachal Pradesh',
      lat: 32.533,
      lng: 77.016,
      flashFloodRisk: 'LOW',
      landslideRisk: 'MODERATE',
      avalancheRisk: 'EXTREME',
      soilSaturation: 40,
      weatherCondition: 'Sub-Zero Snowstorm (-10°C)',
      recommendedAction: 'Avoid mountain passes. Avalanche warning in effect.',
      lastUpdated: '5 mins ago',
    },
    {
      id: 'REG-04',
      name: 'Dima Hasao Hill Slopes',
      district: 'Dima Hasao',
      state: 'Assam',
      lat: 25.183,
      lng: 93.016,
      flashFloodRisk: 'HIGH',
      landslideRisk: 'CRITICAL',
      avalancheRisk: 'LOW',
      soilSaturation: 92,
      weatherCondition: 'Continuous Monsoon Downpour',
      recommendedAction: 'Avoid unpaved mountain roads and unstable embankment cuts.',
      lastUpdated: '12 mins ago',
    },
    {
      id: 'REG-05',
      name: 'Ramban Highway Corridor',
      district: 'Ramban',
      state: 'J&K',
      lat: 33.233,
      lng: 75.233,
      flashFloodRisk: 'MODERATE',
      landslideRisk: 'VERY HIGH',
      avalancheRisk: 'LOW',
      soilSaturation: 65,
      weatherCondition: 'Intermittent Rain',
      recommendedAction: 'Be cautious of shooting stones and road subsidence along NH-44.',
      lastUpdated: '15 mins ago',
    },
  ];

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('navHazardMap')}</h1>
          <p className="text-slate-500 text-sm">Interactive Multi-Layer GIS Monitoring for Hilly & Himalayan Regions</p>
        </div>
        <div className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-bold text-xs border border-sky-200">
          GIS MULTI-LAYER VIEWER
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Layer Controls Sidebar */}
        <div className="w-full lg:w-72 bg-white border border-slate-200 rounded-2xl shadow-md p-4 flex flex-col overflow-y-auto shrink-0 space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
            <Layers className="w-4 h-4 text-cyan-600" /> Enable / Disable GIS Layers
          </h3>
          <div className="space-y-1.5 text-xs">
            {layersList.map(layer => (
              <label key={layer} className="flex items-center gap-2 text-slate-700 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                <input 
                  type="checkbox" 
                  checked={!!activeLayers[layer]}
                  onChange={() => toggleLayer(layer)}
                  className="rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer w-4 h-4 border-slate-300"
                />
                <span className={activeLayers[layer] ? 'font-extrabold text-slate-900' : 'text-slate-500'}>{layer}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-slate-200 rounded-2xl overflow-hidden shadow-inner border border-slate-300 relative min-h-[400px]">
          <MapContainer 
            center={[29.0, 81.0]} 
            zoom={6} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />
            
            {mapRegions.map((reg) => (
              <CircleMarker
                key={reg.id}
                center={[reg.lat, reg.lng]}
                radius={reg.flashFloodRisk === 'CRITICAL' || reg.landslideRisk === 'CRITICAL' ? 14 : 10}
                pathOptions={{
                  fillColor: reg.flashFloodRisk === 'CRITICAL' ? '#e11d48' : reg.flashFloodRisk === 'VERY HIGH' ? '#ef4444' : '#f59e0b',
                  fillOpacity: 0.8,
                  color: '#ffffff',
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSelectedRegion(reg),
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <strong className="text-slate-900 text-sm block">{reg.name}</strong>
                    <div>State: <strong>{reg.state}</strong></div>
                    <div>Flash Flood Risk: <span className="font-bold text-red-600">{reg.flashFloodRisk}</span></div>
                    <div>Click marker to view full regional hazard breakdown.</div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Region Information Inspector Panel */}
        {selectedRegion && (
          <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-5 flex flex-col shrink-0 overflow-y-auto space-y-4 animate-in slide-in-from-right">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900">{selectedRegion.name}</h3>
                <p className="text-xs text-slate-500 font-semibold">{selectedRegion.district}, {selectedRegion.state}</p>
              </div>
              <button onClick={() => setSelectedRegion(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-600">
                Coordinates: {selectedRegion.lat.toFixed(4)}, {selectedRegion.lng.toFixed(4)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded-lg bg-red-50 text-red-900 font-semibold border border-red-100">
                  <span>Flash Flood Risk:</span>
                  <span className="font-black text-red-700">{selectedRegion.flashFloodRisk}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-amber-50 text-amber-900 font-semibold border border-amber-100">
                  <span>Landslide Risk:</span>
                  <span className="font-black text-amber-700">{selectedRegion.landslideRisk}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 text-slate-800 font-semibold border border-slate-200">
                  <span>Avalanche Risk:</span>
                  <span className="font-black">{selectedRegion.avalancheRisk}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-sky-50 text-sky-900 font-semibold border border-sky-100">
                  <span>Soil Saturation:</span>
                  <span className="font-black text-sky-700">{selectedRegion.soilSaturation}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Weather Condition:</span>
                <p className="text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">{selectedRegion.weatherCondition}</p>
              </div>

              <div className="bg-red-50 p-3 rounded-xl border border-red-200 space-y-1">
                <span className="font-extrabold text-red-900 uppercase text-[10px] block">Recommended Action:</span>
                <p className="text-red-800 font-semibold">{selectedRegion.recommendedAction}</p>
              </div>

              <div className="text-[10px] text-slate-400 border-t pt-2 text-right">
                Last Updated: {selectedRegion.lastUpdated}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
