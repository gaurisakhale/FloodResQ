import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw, Server, ShieldCheck } from 'lucide-react';

export const IntegrationStatus: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([
    { name: 'Weather API (IMD / OpenWeather)', service: 'Weather API', status: 'DEMO', message: 'Using simulated telemetry feed. Set OPENWEATHER_API_KEY to connect live.', time: 'Just now' },
    { name: 'InSAR Satellite Feed (Sentinel-1 / NISAR)', service: 'InSAR Feed', status: 'DEMO', message: 'Using Uttarakhand demo displacement data. Set INSAR_API_KEY to connect.', time: 'Just now' },
    { name: 'Avalanche Radar Telemetry (SASE)', service: 'Avalanche Feed', status: 'DEMO', message: 'Awaiting hardware radar endpoint connection.', time: 'Just now' },
    { name: 'Satellite SOS Transponder Gateway', service: 'Satellite SOS', status: 'NOT_CONFIGURED', message: 'SOS recorded successfully. Satellite transmission is not configured in this deployment.', time: 'Just now' },
    { name: 'SMS Gateway (MSG91 / NDMA)', service: 'SMS Gateway', status: 'NOT_CONFIGURED', message: 'Set MSG91_API_KEY to enable automated emergency SMS dispatch.', time: 'Just now' },
    { name: 'Government Emergency Alert Feed (NDMA / CWC)', service: 'Government Alert Feed', status: 'NOT_CONFIGURED', message: 'Set GOV_ALERT_WEBHOOK_URL to subscribe to official government alerts.', time: 'Just now' },
  ]);

  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/integration-status');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setIntegrations(prev => prev.map(item => {
            const match = data.find((d: any) => d.service?.toLowerCase().includes(item.service.toLowerCase()) || d.name?.toLowerCase().includes(item.service.toLowerCase()));
            if (match) {
              return {
                ...item,
                status: match.status || item.status,
                message: match.message || item.message,
                time: match.lastChecked ? new Date(match.lastChecked).toLocaleTimeString() : 'Just now'
              };
            }
            return item;
          }));
        }
      }
    } catch (err) {
      console.warn('Integration status fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED': return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'ERROR': return <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
      case 'DEMO': return <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'NOT_CONFIGURED': return <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ERROR': return 'bg-red-50 text-red-700 border-red-200';
      case 'DEMO': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'NOT_CONFIGURED': return 'bg-slate-100 text-slate-600 border-slate-300';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">System Integration & Telemetry Status</h1>
          <p className="text-slate-500 text-sm">Real-Time External Service Adapters & Emergency Infrastructure Diagnostics</p>
        </div>
        <button 
          onClick={fetchStatus}
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Run Diagnostics
        </button>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 flex gap-3 shadow-sm">
        <Server className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-sky-950 block">Environment Variable Configuration:</span>
          <p className="leading-relaxed">
            External services use modular backend adapters (`EmergencyCommunicationService`, `WeatherService`, `InSARService`). To activate production live feeds, set environment variables (e.g. <code>SATELLITE_SOS_API_KEY</code>, <code>MSG91_API_KEY</code>, <code>INSAR_API_KEY</code>) in your backend environment.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600" /> Active External Integration Adapters
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">DEMO_MODE=true</span>
        </div>

        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Integration Adapter</th>
              <th className="p-4">Connection Status</th>
              <th className="p-4">Status Description & Gateway Output</th>
              <th className="p-4">Last Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {integrations.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-2.5">
                  {getStatusIcon(item.status)} <span>{item.name}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-slate-600 font-medium">{item.message}</td>
                <td className="p-4 font-mono text-[11px] text-slate-400">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
