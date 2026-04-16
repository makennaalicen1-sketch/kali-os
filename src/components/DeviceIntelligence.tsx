import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Camera, MapPin, Battery, Wifi, Cpu, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface DeviceInfo {
  battery: string;
  platform: string;
  cores: number;
  memory: string;
  connection: string;
}

export default function DeviceIntelligence() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Basic Device Info
    setDeviceInfo({
      battery: 'Detecting...',
      platform: navigator.platform,
      cores: navigator.hardwareConcurrency || 0,
      memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'Unknown',
      connection: (navigator as any).connection ? (navigator as any).connection.effectiveType : 'Unknown'
    });

    // Battery Info
    if ((navigator as any).getBattery) {
      (navigator as any).getBattery().then((batt: any) => {
        setDeviceInfo(prev => prev ? { ...prev, battery: `${Math.round(batt.level * 100)}%` } : null);
      });
    }
  }, []);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.error("Location access denied", err)
    );
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
  };

  return (
    <div className="p-6 bg-[#1c1c21] border border-[#2d2d35] rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[#9333ea]">
          <Smartphone className="w-5 h-5" />
          Device Intelligence
        </h2>
        <div className="flex items-center gap-2 px-2 py-1 bg-[#9333ea]/10 border border-[#9333ea]/20 rounded text-[10px] text-[#9333ea] font-bold">
          <ShieldCheck className="w-3 h-3" />
          SECURE ACCESS
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Hardware Specs */}
        <div className="space-y-4">
          <div className="bg-black/50 p-4 rounded border border-[#2d2d35]">
            <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-4">Hardware Telemetry</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#1c1c21] rounded border border-[#2d2d35]">
                <div className="flex items-center gap-2 text-[#9ca3af] mb-1">
                  <Battery className="w-3 h-3" />
                  <span className="text-[10px] uppercase">Battery</span>
                </div>
                <p className="text-sm font-bold terminal-text">{deviceInfo?.battery}</p>
              </div>
              <div className="p-3 bg-[#1c1c21] rounded border border-[#2d2d35]">
                <div className="flex items-center gap-2 text-[#9ca3af] mb-1">
                  <Cpu className="w-3 h-3" />
                  <span className="text-[10px] uppercase">Cores</span>
                </div>
                <p className="text-sm font-bold terminal-text">{deviceInfo?.cores}</p>
              </div>
              <div className="p-3 bg-[#1c1c21] rounded border border-[#2d2d35]">
                <div className="flex items-center gap-2 text-[#9ca3af] mb-1">
                  <Wifi className="w-3 h-3" />
                  <span className="text-[10px] uppercase">Network</span>
                </div>
                <p className="text-sm font-bold terminal-text uppercase">{deviceInfo?.connection}</p>
              </div>
              <div className="p-3 bg-[#1c1c21] rounded border border-[#2d2d35]">
                <div className="flex items-center gap-2 text-[#9ca3af] mb-1">
                  <Info className="w-3 h-3" />
                  <span className="text-[10px] uppercase">Memory</span>
                </div>
                <p className="text-sm font-bold terminal-text">{deviceInfo?.memory}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded border border-[#2d2d35]">
            <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-4">Geolocation Sensor</h3>
            {location ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs terminal-text">
                  <span className="text-[#9ca3af]">LATITUDE:</span>
                  <span className="text-[#9333ea]">{location.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between text-xs terminal-text">
                  <span className="text-[#9ca3af]">LONGITUDE:</span>
                  <span className="text-[#9333ea]">{location.lon.toFixed(6)}</span>
                </div>
                <div className="mt-4 h-24 bg-[#1c1c21] rounded flex items-center justify-center border border-[#2d2d35]">
                  <MapPin className="w-8 h-8 text-[#9333ea] opacity-20" />
                  <span className="text-[10px] text-[#9ca3af] ml-2">MAP DATA INTEGRATED</span>
                </div>
              </div>
            ) : (
              <button 
                onClick={requestLocation}
                className="w-full py-3 border border-dashed border-[#2d2d35] rounded text-xs text-[#9ca3af] hover:border-[#9333ea] hover:text-[#9333ea] transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                REQUEST LOCATION ACCESS
              </button>
            )}
          </div>
        </div>

        {/* Visual Sensors */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 bg-black rounded border border-[#2d2d35] relative overflow-hidden flex flex-col">
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 px-2 py-1 bg-black/80 rounded border border-[#2d2d35] text-[10px] font-mono">
              <Camera className={`w-3 h-3 ${cameraActive ? 'text-red-500 animate-pulse' : 'text-[#9ca3af]'}`} />
              {cameraActive ? 'LIVE FEED' : 'CAMERA STANDBY'}
            </div>
            
            <div className="flex-1 flex items-center justify-center bg-zinc-950">
              {cameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover grayscale opacity-80"
                />
              ) : (
                <div className="text-center space-y-2 opacity-20">
                  <Camera className="w-16 h-16 mx-auto" />
                  <p className="text-xs uppercase tracking-widest">Sensor Offline</p>
                </div>
              )}
            </div>

            <button 
              onClick={toggleCamera}
              className={`p-4 text-xs font-bold uppercase tracking-widest transition-all ${
                cameraActive ? 'bg-red-500/10 text-red-500 border-t border-red-500/20 hover:bg-red-500/20' : 'bg-[#9333ea]/10 text-[#9333ea] border-t border-[#9333ea]/20 hover:bg-[#9333ea]/20'
              }`}
            >
              {cameraActive ? 'DEACTIVATE SENSOR' : 'ACTIVATE CAMERA'}
            </button>
          </div>

          <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded text-[10px] text-[#9ca3af] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <p><strong>Privacy Note:</strong> This module demonstrates how applications access hardware sensors. In a defensive context, understanding these permissions is key to preventing unauthorized data exfiltration and tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
