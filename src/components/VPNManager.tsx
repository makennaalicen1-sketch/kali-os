import React, { useState, useEffect } from 'react';
import { Shield, Lock, Globe, Zap, Power, Server, ShieldAlert, Activity, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VPNServer {
  id: string;
  name: string;
  country: string;
  latency: number;
  load: number;
  flag: string;
}

const SERVERS: VPNServer[] = [
  { id: 'us-east', name: 'US East (Virginia)', country: 'USA', latency: 42, load: 65, flag: '🇺🇸' },
  { id: 'ch-zurich', name: 'Zurich Secure', country: 'Switzerland', latency: 120, load: 30, flag: '🇨🇭' },
  { id: 'is-reykjavik', name: 'Reykjavik Core', country: 'Iceland', latency: 145, load: 15, flag: '🇮🇸' },
  { id: 'jp-tokyo', name: 'Tokyo Edge', country: 'Japan', latency: 210, load: 85, flag: '🇯🇵' },
  { id: 'de-frankfurt', name: 'Frankfurt Node', country: 'Germany', latency: 95, load: 50, flag: '🇩🇪' },
];

export default function VPNManager() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState<VPNServer>(SERVERS[1]); // Default to Zurich for privacy
  const [protocol, setProtocol] = useState('OpenVPN (UDP)');
  const [killSwitch, setKillSwitch] = useState(true);
  const [obfuscation, setObfuscation] = useState(true);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setUptime(prev => prev + 1);
      }, 1000);
    } else {
      setUptime(0);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleToggle = () => {
    if (isConnected) {
      setIsConnected(false);
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2500);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 bg-[#1c1c21] border border-[#2d2d35] rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isConnected ? 'bg-[#9333ea]/20 text-[#9333ea]' : 'bg-zinc-800 text-zinc-500'}`}>
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#f3f4f6]">Secure VPN Tunnel</h2>
            <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest">Advanced Privacy Layer</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-[10px] font-bold flex items-center gap-2 ${
          isConnected ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
          isConnecting ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
          'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : isConnecting ? 'bg-yellow-400 animate-spin' : 'bg-red-400'}`} />
          {isConnected ? 'ENCRYPTED' : isConnecting ? 'ESTABLISHING...' : 'DISCONNECTED'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Connection Control */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-black/40 p-8 rounded-2xl border border-[#2d2d35] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-technical-grid opacity-10" />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggle}
              disabled={isConnecting}
              className={`w-32 h-32 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${
                isConnected 
                  ? 'bg-[#9333ea] shadow-[0_0_50px_rgba(147,51,234,0.3)]' 
                  : 'bg-zinc-900 border-2 border-[#2d2d35] hover:border-[#9333ea]/50'
              }`}
            >
              <Power className={`w-12 h-12 ${isConnected ? 'text-white' : 'text-zinc-700'}`} />
              {isConnecting && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth="4"
                    strokeDasharray="377"
                    strokeDashoffset="377"
                    className="animate-[progress_2.5s_ease-in-out_infinite]"
                  />
                </svg>
              )}
            </motion.button>

            <div className="mt-8 text-center z-10">
              <p className="text-sm font-mono text-[#9ca3af] mb-1">
                {isConnected ? 'Connected to ' + selectedServer.name : 'System Unprotected'}
              </p>
              <p className="text-2xl font-bold text-[#f3f4f6]">
                {isConnected ? formatTime(uptime) : '00:00:00'}
              </p>
            </div>

            {isConnected && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex gap-4 z-10"
              >
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase">IP Address</p>
                  <p className="text-xs font-mono text-[#9333ea]">185.12.44.102</p>
                </div>
                <div className="w-px h-8 bg-[#2d2d35]" />
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase">Encryption</p>
                  <p className="text-xs font-mono text-[#9333ea]">AES-256-GCM</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 p-4 rounded-xl border border-[#2d2d35] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#9333ea]" />
                  <span className="text-xs font-bold text-[#f3f4f6]">Kill Switch</span>
                </div>
                <button 
                  onClick={() => setKillSwitch(!killSwitch)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${killSwitch ? 'bg-[#9333ea]' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${killSwitch ? 'left-4.5' : 'left-0.5'}`} />
                </button>
              </div>
              <p className="text-[10px] text-[#9ca3af]">Blocks all internet traffic if the VPN connection drops unexpectedly.</p>
            </div>
            <div className="bg-black/20 p-4 rounded-xl border border-[#2d2d35] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#9333ea]" />
                  <span className="text-xs font-bold text-[#f3f4f6]">Obfuscation</span>
                </div>
                <button 
                  onClick={() => setObfuscation(!obfuscation)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${obfuscation ? 'bg-[#9333ea]' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${obfuscation ? 'left-4.5' : 'left-0.5'}`} />
                </button>
              </div>
              <p className="text-[10px] text-[#9ca3af]">Disguises VPN traffic as regular HTTPS to bypass deep packet inspection.</p>
            </div>
          </div>
        </div>

        {/* Server Selection */}
        <div className="flex flex-col space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest">Select Node</h3>
            <RefreshCw className="w-3 h-3 text-zinc-600 cursor-pointer hover:text-[#9333ea] transition-colors" />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {SERVERS.map((server) => (
              <button
                key={server.id}
                onClick={() => setSelectedServer(server)}
                className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between group ${
                  selectedServer.id === server.id 
                    ? 'bg-[#9333ea]/10 border-[#9333ea] text-[#f3f4f6]' 
                    : 'bg-black/20 border-[#2d2d35] text-[#9ca3af] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{server.flag}</span>
                  <div className="text-left">
                    <p className="text-xs font-bold">{server.name}</p>
                    <p className="text-[10px] opacity-50">{server.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Activity className={`w-3 h-3 ${server.latency < 100 ? 'text-green-500' : 'text-yellow-500'}`} />
                    <span className="text-[10px] font-mono">{server.latency}ms</span>
                  </div>
                  <div className="w-16 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${server.load > 80 ? 'bg-red-500' : 'bg-[#9333ea]'}`} 
                      style={{ width: `${server.load}%` }} 
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 bg-[#141417] border border-[#2d2d35] rounded-xl space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-zinc-500">
              <span>Protocol</span>
              <span className="text-[#9333ea] cursor-pointer hover:underline">Change</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#f3f4f6]">
              <Zap className="w-3 h-3 text-[#9333ea]" />
              {protocol}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          from { stroke-dashoffset: 377; }
          to { stroke-dashoffset: 0; }
        }
      `}} />
    </div>
  );
}
