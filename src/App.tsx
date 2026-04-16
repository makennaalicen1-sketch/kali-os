import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  Bug, 
  Bot, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  Search,
  Cpu,
  Network,
  Lock,
  Terminal,
  Download,
  Globe,
  Smartphone,
  ShieldOff,
  Menu,
  X
} from 'lucide-react';
import AuthSimulator from './components/AuthSimulator';
import VulnerabilityScanner from './components/VulnerabilityScanner';
import NetworkMonitor from './components/NetworkMonitor';
import AIAdvisor from './components/AIAdvisor';
import NetworkIntelligence from './components/NetworkIntelligence';
import DeviceIntelligence from './components/DeviceIntelligence';
import AICommandCenter from './components/AICommandCenter';
import VPNManager from './components/VPNManager';
import { motion } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiCommandData, setAiCommandData] = useState<{ type: string, payload: any } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAICommand = (name: string, args: any) => {
    console.log("AI Command Received:", name, args);
    if (name === 'switch_tab') {
      setActiveTab(args.tabId);
    } else if (name === 'analyze_site_security') {
      setActiveTab('intelligence');
      setAiCommandData({ type: 'analyze', payload: args.url });
    } else if (name === 'toggle_vpn') {
      setActiveTab('vpn');
      // The VPN component handles its own state, but we could pass a prop if needed
      // For now, switching to the tab is the primary feedback
    } else if (name === 'reset_simulators') {
      window.location.reload(); // Simple reset
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'auth', icon: Lock, label: 'Auth Simulator' },
    { id: 'vulnerabilities', icon: Bug, label: 'Vuln Scanner' },
    { id: 'network', icon: Network, label: 'Network Monitor' },
    { id: 'intelligence', icon: Globe, label: 'Net Intelligence' },
    { id: 'device', icon: Smartphone, label: 'Device Intel' },
    { id: 'vpn', icon: ShieldOff, label: 'VPN Tunnel' },
    { id: 'ai', icon: Bot, label: 'AI Advisor' },
  ];

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-[#0c0c0d] text-[#f3f4f6] flex flex-col technical-grid">
          <div className="scanline" />
          
          {/* Header */}
          <header className="h-16 border-b border-[#2d2d35] bg-[#141417]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-[#1c1c21] rounded-lg transition-colors text-[#9ca3af]"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#9333ea]/10 border border-[#9333ea]/30 rounded flex items-center justify-center">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#9333ea]" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm md:text-lg font-bold tracking-tighter uppercase">CyberDefense <span className="text-[#9333ea]">Hub</span></h1>
                <p className="text-[8px] md:text-[10px] text-[#9ca3af] font-mono uppercase tracking-widest">Defensive Security Suite v1.0.4</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-[#9ca3af]">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                  SYSTEM SECURE
                </div>
                <div className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  CPU: 12%
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  DL: 1.2MB/s
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#1c1c21] rounded-full transition-colors relative">
                  <Bell className="w-5 h-5 text-[#9ca3af]" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
                </button>
                <button className="p-2 hover:bg-[#1c1c21] rounded-full transition-colors">
                  <Settings className="w-5 h-5 text-[#9ca3af]" />
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside className={`
              fixed inset-y-0 left-0 z-50 w-64 border-r border-[#2d2d35] bg-[#141417] flex flex-col p-4 gap-2 transition-transform duration-300 lg:relative lg:translate-x-0
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-4 px-2">Navigation</p>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-all group border-l-4 ${
                    activeTab === item.id 
                      ? 'bg-[#9333ea]/10 text-[#f3f4f6] border-[#9333ea]' 
                      : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#1c1c21] border-transparent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#9333ea]' : 'text-[#9ca3af] group-hover:text-[#f3f4f6]'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
              
              <div className="mt-auto p-4 bg-[#1c1c21] border border-[#2d2d35] rounded">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9ca3af] mb-2">
                  <Terminal className="w-3 h-3" />
                  SESSION LOG
                </div>
                <div className="space-y-1 text-[10px] font-mono text-[#22c55e]">
                  <p>{'>'} AUTH_READY</p>
                  <p>{'>'} NET_MON_ACTIVE</p>
                  <p>{'>'} AI_ADVISOR_ONLINE</p>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              <div className="w-full">
                {activeTab === 'dashboard' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 bg-gradient-to-br from-[#1c1c21] to-[#0c0c0d] border border-[#2d2d35] rounded-xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                          <Shield className="w-48 h-48" />
                        </div>
                        <div className="relative z-10">
                          <h2 className="text-3xl font-bold mb-2">Welcome to the <span className="text-[#9333ea]">Defense Command</span></h2>
                          <p className="text-[#9ca3af] max-w-2xl mb-6">
                            This platform is designed for security professionals and students to explore defensive strategies, 
                            monitor simulated network threats, and learn how to harden systems against modern attack vectors.
                          </p>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => setActiveTab('ai')}
                              className="px-6 py-2 bg-[#9333ea] text-white font-bold rounded hover:bg-opacity-90 transition-all"
                            >
                              CONSULT AI ADVISOR
                            </button>
                            <button 
                              onClick={() => setActiveTab('auth')}
                              className="px-6 py-2 bg-[#1c1c21] text-white font-bold rounded border border-[#2d2d35] hover:bg-[#2d2d35] transition-all"
                            >
                              TEST AUTH SECURITY
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="h-[500px] lg:col-span-2">
                      <NetworkIntelligence />
                    </div>
                    <div className="h-[500px]">
                      <NetworkMonitor />
                    </div>
                    <div className="h-[500px]">
                      <AuthSimulator />
                    </div>
                    <div className="h-[500px]">
                      <VulnerabilityScanner />
                    </div>
                    <div className="h-[500px]">
                      <DeviceIntelligence />
                    </div>
                    <div className="h-[500px]">
                      <VPNManager />
                    </div>
                    <div className="h-[500px]">
                      <AIAdvisor />
                    </div>
                  </div>
                )}

                {activeTab === 'auth' && (
                  <div className="max-w-2xl mx-auto h-[600px]">
                    <AuthSimulator />
                  </div>
                )}

                {activeTab === 'vulnerabilities' && (
                  <div className="max-w-4xl mx-auto h-[700px]">
                    <VulnerabilityScanner />
                  </div>
                )}

                {activeTab === 'network' && (
                  <div className="max-w-5xl mx-auto h-[600px]">
                    <NetworkMonitor />
                  </div>
                )}

                {activeTab === 'intelligence' && (
                  <div className="max-w-6xl mx-auto h-[700px]">
                    <NetworkIntelligence initialUrl={aiCommandData?.type === 'analyze' ? aiCommandData.payload : undefined} />
                  </div>
                )}

                {activeTab === 'device' && (
                  <div className="max-w-5xl mx-auto h-[600px]">
                    <DeviceIntelligence />
                  </div>
                )}

                {activeTab === 'vpn' && (
                  <div className="max-w-5xl mx-auto h-[600px]">
                    <VPNManager />
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="max-w-3xl mx-auto h-[700px]">
                    <AIAdvisor />
                  </div>
                )}
              </div>
            </main>
          </div>

          {/* Footer */}
          <footer className="h-10 border-t border-[#2d2d35] bg-[#0c0c0d] flex items-center justify-between px-6 text-[10px] font-mono text-[#9ca3af]">
            <div className="flex gap-4">
              <span>UPTIME: 12:45:02</span>
              <span>WLAN0: MONITOR MODE ON</span>
              <span>ETH0: DISCONNECTED</span>
              <span>BATTERY: 88%</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[#22c55e]">ENCRYPTION: AES-256</span>
              <span>STATUS: OPERATIONAL</span>
            </div>
          </footer>

          <AICommandCenter onCommand={handleAICommand} activeTab={activeTab} />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
