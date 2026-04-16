import React, { useState, useEffect } from 'react';
import { Activity, Globe, Shield, Zap, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    traffic: Math.floor(Math.random() * 100) + 20,
    threats: Math.floor(Math.random() * 10),
  }));
};

export default function NetworkMonitor() {
  const [data, setData] = useState(generateData());
  const [alerts, setAlerts] = useState<{ id: number; msg: string; type: 'info' | 'warn' | 'crit' }[]>([]);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/network-health');
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        console.error("Failed to fetch network health", err);
      }
    };

    fetchHealth();
    const healthInterval = setInterval(fetchHealth, 10000);

    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          traffic: Math.floor(Math.random() * 100) + 20,
          threats: Math.floor(Math.random() * 10),
        }];
        
        // Random alert generation
        if (Math.random() > 0.8) {
          const types: ('info' | 'warn' | 'crit')[] = ['info', 'warn', 'crit'];
          const type = types[Math.floor(Math.random() * types.length)];
          const msgs = {
            info: 'Normal traffic spike detected on Port 443',
            warn: 'Unusual outbound connection from 192.168.1.45',
            crit: 'Potential Port Scan detected from 45.23.11.2'
          };
          setAlerts(a => [{ id: Date.now(), msg: msgs[type], type }, ...a].slice(0, 5));
        }

        return newData;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(healthInterval);
    };
  }, []);

  return (
    <div className="p-6 bg-[#1c1c21] border border-[#2d2d35] rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[#9333ea]">
          <Activity className="w-5 h-5" />
          Global Network Intelligence
        </h2>
        <div className="flex gap-4 text-[10px] terminal-text">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#9333ea] rounded-full" />
            <span className="text-[#9ca3af]">TRAFFIC</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-[#9ca3af]">THREATS</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d35" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 120]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0c0c0d', border: '1px solid #2d2d35', borderRadius: '4px' }}
              itemStyle={{ color: '#9333ea', fontSize: '12px', fontFamily: 'monospace' }}
            />
            <Area type="monotone" dataKey="traffic" stroke="#9333ea" fillOpacity={1} fill="url(#colorTraffic)" isAnimationActive={false} />
            <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-black/30 border border-[#2d2d35] rounded-lg">
          <p className="text-[10px] text-[#9ca3af] uppercase mb-2">Regional Latency</p>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-500">N. AMERICA</span>
              <span className="text-[#9333ea] font-mono">{health?.latency.northAmerica || '--'}ms</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-500">EUROPE</span>
              <span className="text-[#9333ea] font-mono">{health?.latency.europe || '--'}ms</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-500">ASIA</span>
              <span className="text-[#9333ea] font-mono">{health?.latency.asia || '--'}ms</span>
            </div>
          </div>
        </div>
        <div className="p-3 bg-black/30 border border-[#2d2d35] rounded-lg flex flex-col justify-center">
          <p className="text-[10px] text-[#9ca3af] uppercase mb-1">Active Global Threats</p>
          <p className="text-xl font-bold text-red-500 font-mono">
            {health?.activeThreats.toLocaleString() || '---'}
          </p>
          <p className="text-[8px] text-zinc-600 uppercase">Real-time detection active</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-2">Live Security Events</h3>
        <div className="space-y-1">
          {alerts.length > 0 ? alerts.map(alert => (
            <div key={alert.id} className={`flex items-center gap-3 p-2 rounded text-xs terminal-text border ${
              alert.type === 'crit' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              alert.type === 'warn' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
              'bg-[#9333ea]/10 border-[#9333ea]/20 text-[#9333ea]/80'
            }`}>
              {alert.type === 'crit' ? <AlertCircle className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              <span className="flex-1 truncate">{alert.msg}</span>
              <span className="text-[10px] opacity-50">{new Date(alert.id).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
          )) : (
            <div className="text-center py-4 text-[#9ca3af] text-xs italic">
              Monitoring global network interfaces...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
