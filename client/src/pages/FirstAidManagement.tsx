import React, { useState } from 'react';
import { Package, User, MapPin, CheckCircle, Truck, XCircle, Boxes, ShieldAlert, Archive } from 'lucide-react';

export const FirstAidManagement: React.FC = () => {
  const [inventory, setInventory] = useState([
    { id: 'INV-01', branch: 'Kedarnath Taskforce HQ', available: 120, reserved: 25, dispatched: 85, waitingRequests: 3, lastUpdated: '10 mins ago' },
    { id: 'INV-02', branch: 'Joshimath Rescue Branch', available: 80, reserved: 15, dispatched: 45, waitingRequests: 1, lastUpdated: '30 mins ago' },
    { id: 'INV-03', branch: 'North Sikkim Alpine Post', available: 65, reserved: 20, dispatched: 90, waitingRequests: 4, lastUpdated: '5 mins ago' },
    { id: 'INV-04', branch: 'Dima Hasao Hill Base', available: 95, reserved: 10, dispatched: 60, waitingRequests: 2, lastUpdated: '15 mins ago' },
  ]);

  const [requests, setRequests] = useState([
    { id: 'FIRSTAID-1029', name: 'Ram Bahadur', location: 'Kedarnath Valley', people: 4, emergency: 'Minor cuts, trauma kit required', branch: 'Kedarnath Taskforce HQ', time: '10 mins ago', status: 'NEW', priority: 'HIGH' },
    { id: 'FIRSTAID-1028', name: 'Sita Sharma', location: 'Joshimath Ridge', people: 2, emergency: 'Cold exposure & bandages needed', branch: 'Joshimath Rescue Branch', time: '1 hr ago', status: 'PACKED', priority: 'MEDIUM' },
    { id: 'FIRSTAID-1027', name: 'Pemba Sherpa', location: 'North Sikkim Basin', people: 6, emergency: 'Trauma & burn medical kit', branch: 'North Sikkim Alpine Post', time: '2 hrs ago', status: 'DISPATCHED', priority: 'CRITICAL' },
  ]);

  const updateStatus = (id: string, status: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const statusList = ['NEW', 'APPROVED', 'PACKED', 'DISPATCHED', 'DELIVERED', 'UNABLE_TO_FULFIL'];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">First Aid Inventory & Distribution Management</h1>
          <p className="text-slate-500 text-sm">Internal Stock Audit & Regional Rescue Branch Distribution Console</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-lg">
          <Boxes className="w-4 h-4 text-cyan-400" />
          <span>Total Network Reserve: 360 Emergency Kits</span>
        </div>
      </div>

      {/* Branch Stock Inventory Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventory.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-extrabold text-slate-900 text-xs">{item.branch}</span>
              <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Available</span>
                <span className="text-lg font-black text-emerald-700">{item.available}</span>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Reserved</span>
                <span className="text-lg font-black text-amber-700">{item.reserved}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">Dispatched: <strong className="text-slate-800">{item.dispatched}</strong></span>
              <span className="text-slate-500">Waiting: <strong className="text-red-600">{item.waitingRequests}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* First Aid Request Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">First Aid Request Distribution Queue</h3>
          <span className="text-xs text-slate-400 font-bold">Authorized Operations View</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Request ID & Time</th>
                <th className="p-4">Citizen & Location</th>
                <th className="p-4">Branch</th>
                <th className="p-4">Emergency Requirement</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Distribution Status</th>
                <th className="p-4 text-right">Update Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900 font-mono">{req.id}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{req.time}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900 flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {req.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-600" /> {req.location} ({req.people} ppl)</div>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{req.branch}</td>
                  <td className="p-4 text-slate-600 font-medium">{req.emergency}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${req.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 text-xs outline-none cursor-pointer"
                    >
                      {statusList.map(st => (
                        <option key={st} value={st}>{st.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button onClick={() => updateStatus(req.id, 'APPROVED')} className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold border border-emerald-200 text-[11px]">
                      Approve
                    </button>
                    <button onClick={() => updateStatus(req.id, 'PACKED')} className="px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-bold border border-amber-200 text-[11px]">
                      Pack
                    </button>
                    <button onClick={() => updateStatus(req.id, 'DISPATCHED')} className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold border border-blue-200 text-[11px]">
                      Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
