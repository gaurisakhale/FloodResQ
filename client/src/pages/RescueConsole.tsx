import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
import { SOSIncident, RescueTeam, FirstAidSOSRequest } from '../types';
import {
  Shield,
  Radio,
  Users,
  AlertTriangle,
  Send,
  MapPin,
  CheckCircle2,
  Phone,
  Navigation,
  Flame,
  PackagePlus,
  RefreshCw
} from 'lucide-react';

export const RescueConsole: React.FC = () => {
  const { incidents, rescueTeams } = useSocket();
  const { t } = useLanguage();

  const [firstAidRequests, setFirstAidRequests] = useState<FirstAidSOSRequest[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const fetchFirstAidRequests = async () => {
    try {
      const token = localStorage.getItem('floodguard_token');
      const res = await fetch('/api/first-aid-sos', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setFirstAidRequests(data);
      }
    } catch (err) {
      console.warn('Could not fetch first aid requests:', err);
    }
  };

  useEffect(() => {
    fetchFirstAidRequests();
    const interval = setInterval(fetchFirstAidRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const combinedList = [
    ...firstAidRequests.map(fa => ({
      id: fa.id,
      citizenName: fa.citizenName,
      headcount: fa.numberOfPeople,
      district: fa.district || fa.state,
      zoneName: fa.location,
      priorityScore: fa.priorityScore || fa.numberOfPeople * 10,
      mode: 'FIRST_AID_SOS',
      status: fa.status,
      location: {
        addressDescription: fa.location,
        lat: fa.lat || 30.7352,
        lng: fa.lng || 79.0669
      },
      medicalUrgency: 'HIGH',
      note: fa.emergencyDescription || 'First Aid Kit Required',
      assignedTeamName: fa.nearestRescueCenterName,
      commsLog: fa.statusHistory.map((h, i) => ({
        id: `fa-log-${i}`,
        sender: h.updatedBy || 'System',
        role: 'RESCUE_TEAM',
        message: `Status set to ${h.status}`,
        timestamp: h.timestamp
      })),
      isFirstAid: true,
      rawItem: fa
    })),
    ...incidents.map(inc => ({
      ...inc,
      isFirstAid: false
    }))
  ].sort((a, b) => b.priorityScore - a.priorityScore);

  const activeIncident = selectedIncident || combinedList[0];

  const handleStatusChange = async (status: string) => {
    if (!activeIncident) return;

    if (activeIncident.isFirstAid) {
      try {
        const token = localStorage.getItem('floodguard_token');
        await fetch(`/api/first-aid-sos/${activeIncident.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status })
        });
        fetchFirstAidRequests();
      } catch (err) {
        console.error('Failed to update first aid SOS status:', err);
      }
    } else {
      try {
        const token = localStorage.getItem('floodguard_token');
        await fetch(`/api/incidents/${activeIncident.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status })
        });
      } catch (err) {
        console.error('Failed to update incident status:', err);
      }
    }
  };

  const handleAssignTeam = async (teamId: string) => {
    if (!activeIncident || activeIncident.isFirstAid) return;

    try {
      const token = localStorage.getItem('floodguard_token');
      const res = await fetch(`/api/incidents/${activeIncident.id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ teamId }),
      });

      if (res.ok) {
        setAssignModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to assign team:', err);
    }
  };

  const handleSendComms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeIncident) return;

    if (!activeIncident.isFirstAid) {
      try {
        const token = localStorage.getItem('floodguard_token');
        await fetch(`/api/incidents/${activeIncident.id}/comms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            sender: 'Command Operations Officer',
            role: 'COMMAND_CENTER',
            message: chatInput.trim(),
          }),
        });
        setChatInput('');
      } catch (err) {
        console.error('Failed to send comms message:', err);
      }
    } else {
      setChatInput('');
    }
  };

  const statusList = [
    'NEW', 'ACKNOWLEDGED', 'TEAM ASSIGNED', 'DISPATCHED', 'EN ROUTE', 'REACHED LOCATION', 'ASSISTANCE PROVIDED', 'CLOSED'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            Himalayan Rescue Taskforce Operations Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time priority dispatch queue, citizen First Aid SOS, nearest branch routing & status updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchFirstAidRequests} className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs flex items-center gap-1 font-bold">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/40 px-3.5 py-2 rounded-xl text-xs font-mono text-red-300 font-bold">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Active SOS Queue: {combinedList.filter(i => i.status !== 'CLOSED' && i.status !== 'RESCUED').length} Incidents</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priority Incident Queue */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Priority Emergency Queue</span>
            <span className="text-[10px] text-slate-500">Sorted by Priority Score</span>
          </h2>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {combinedList.map((inc) => {
              const isSelected = activeIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-900 border-red-500/80 shadow-lg ring-1 ring-red-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>{inc.citizenName}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                          {inc.id}
                        </span>
                      </div>
                      <p className={`text-xs flex items-center gap-1 mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                        <MapPin className="w-3 h-3" /> {inc.district} ({inc.zoneName})
                      </p>
                    </div>

                    <span className="bg-red-950 text-red-400 border border-red-500/40 text-[11px] font-mono px-2 py-0.5 rounded font-bold shrink-0">
                      Score {inc.priorityScore}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      <span>{inc.headcount} Affected</span>
                    </div>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border border-slate-200">
                      {inc.mode.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        inc.status === 'CLOSED' || inc.status === 'RESCUED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800 animate-pulse'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Incident Console */}
        {activeIncident ? (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-700 font-extrabold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 uppercase">
                      {activeIncident.mode.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      ID: {activeIncident.id}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {activeIncident.citizenName} — {activeIncident.headcount} Affected Citizens
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Location: {activeIncident.location.addressDescription}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-slate-400 font-bold">Medical Urgency:</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-black">
                    {activeIncident.medicalUrgency || 'HIGH'}
                  </span>
                </div>
              </div>

              {/* Distress Description */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Distress Description / Emergency Details:</span>
                <p className="text-slate-800 font-medium text-sm">"{activeIncident.note}"</p>
              </div>

              {/* Status Update & Taskforce Action Bar */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider block">Operational Status Lifecycle</span>
                    <span className="text-xs text-slate-400">Update request status to progress dispatch workflow.</span>
                  </div>

                  {!activeIncident.isFirstAid && (
                    <button
                      onClick={() => setAssignModalOpen(true)}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Navigation className="w-4 h-4" /> Assign Rescue Unit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Nearest Rescue Branch:</span>
                    <p className="text-white font-bold text-sm mt-0.5">
                      {activeIncident.assignedTeamName || 'Central Rescue Branch'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Update Status Stage:</span>
                    <select
                      value={activeIncident.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full bg-slate-950 text-cyan-300 font-extrabold border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer"
                    >
                      {statusList.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Comms Log */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Live Dispatch Comms Log & Status History
                </h3>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-48 overflow-y-auto space-y-2 text-xs">
                  {activeIncident.commsLog?.map((c: any) => (
                    <div key={c.id} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-cyan-800">{c.sender} ({c.role})</span>
                        <span className="text-slate-400 font-mono">{new Date(c.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-700 font-medium">{c.message}</p>
                    </div>
                  ))}
                </div>

                {!activeIncident.isFirstAid && (
                  <form onSubmit={handleSendComms} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Broadcast operational update..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Taskforce Assignment Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-red-600" />
              Dispatch Rescue Unit to {activeIncident?.citizenName}
            </h3>

            <div className="space-y-3">
              {rescueTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{team.name}</h4>
                    <p className="text-slate-500 mt-0.5">
                      Leader: {team.unitLeader} | Vehicle: <strong>{team.vehicleType}</strong>
                    </p>
                    <span className="text-emerald-700 font-bold text-[10px]">Status: {team.status}</span>
                  </div>

                  <button
                    onClick={() => handleAssignTeam(team.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs shadow"
                  >
                    Dispatch Now
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setAssignModalOpen(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
