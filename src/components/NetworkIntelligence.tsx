import React, { useState, useEffect } from 'react';
import { Globe, Search, ShieldCheck, AlertCircle, ExternalLink, Activity, Radio, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderAnalysis {
  [key: string]: string;
}

interface ThreatItem {
  title: string;
  date: string;
}

export default function NetworkIntelligence({ initialUrl }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<HeaderAnalysis | null>(null);
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchThreats();
  }, []);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      handleAnalyze(null, initialUrl);
    }
  }, [initialUrl]);

  const fetchThreats = async () => {
    try {
      const res = await fetch('/api/threat-feed');
      const data = await res.json();
      // CISA feed structure or fallback
      const items = data.items || data.alerts || [];
      setThreats(items.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch threats", err);
    }
  };

  const handleAnalyze = async (e: React.FormEvent | null, overrideUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = overrideUrl || url;
    if (!targetUrl.trim()) return;

    setAnalyzing(true);
    setAnalysis(null);
    setError('');

    try {
      const res = await fetch('/api/analyze-headers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || "Failed to analyze site.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 bg-[#1c1c21] border border-[#2d2d35] rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[#9333ea]">
          <Globe className="w-5 h-5" />
          Network Intelligence
        </h2>
        <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-400 font-bold">
          <Radio className="w-3 h-3 animate-pulse" />
          LIVE FEED
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Site Security Analysis */}
        <div className="flex flex-col space-y-4 overflow-hidden">
          <div className="bg-black/50 p-4 rounded border border-[#2d2d35]">
            <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-3">Security Header Analyzer</h3>
            <form onSubmit={handleAnalyze} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com"
                  className="w-full bg-black border border-[#2d2d35] rounded px-10 py-2 focus:border-[#9333ea] outline-none transition-colors terminal-text text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={analyzing}
                className="px-4 py-2 bg-[#9333ea] text-white font-bold rounded hover:bg-opacity-90 disabled:opacity-50 transition-all"
              >
                {analyzing ? '...' : 'ANALYZE'}
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-[#9ca3af]"
                >
                  <Activity className="w-8 h-8 animate-spin mb-2 text-[#9333ea]" />
                  <p className="text-xs terminal-text">Fetching remote headers...</p>
                </motion.div>
              ) : error ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              ) : analysis ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {Object.entries(analysis).map(([header, value]) => (
                    <div key={header} className="p-3 bg-black border border-[#2d2d35] rounded flex items-center justify-between group hover:border-[#9333ea]/50 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#9ca3af] font-mono">{header}</span>
                        <span className={`text-xs font-bold truncate max-w-[200px] ${value === 'MISSING' ? 'text-red-500' : 'text-[#9333ea]'}`}>
                          {value}
                        </span>
                      </div>
                      {value !== 'MISSING' ? (
                        <ShieldCheck className="w-4 h-4 text-[#9333ea] opacity-50" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 opacity-50" />
                      )}
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#9ca3af] opacity-50 italic text-xs">
                  Enter a URL to analyze its defensive headers.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Threat Feed */}
        <div className="flex flex-col space-y-4 overflow-hidden border-l border-[#2d2d35] pl-6">
          <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest">Live Threat Advisories (CISA)</h3>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {threats.length > 0 ? threats.map((threat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-black/30 border border-[#2d2d35] rounded hover:border-[#9333ea]/30 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-[#f3f4f6] group-hover:text-white transition-colors leading-snug">
                    {threat.title}
                  </p>
                  <ExternalLink className="w-3 h-3 text-[#9ca3af] group-hover:text-[#9333ea] flex-shrink-0" />
                </div>
                <p className="text-[10px] text-[#9ca3af] mt-2 font-mono">
                  {new Date(threat.date).toLocaleDateString()}
                </p>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-[#9ca3af] space-y-2">
                <div className="w-4 h-4 border border-[#2d2d35] border-t-[#9ca3af] rounded-full animate-spin" />
                <p className="text-xs italic">Syncing with global threat feeds...</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded text-[10px] text-[#9ca3af] flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p><strong>Defensive Tip:</strong> Modern browsers use these headers to prevent XSS, Clickjacking, and Protocol Downgrade attacks. Always ensure your production sites have a strong CSP and HSTS policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
