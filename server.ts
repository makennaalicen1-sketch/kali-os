import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Security Header Checker
  app.post("/api/analyze-headers", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      const response = await axios.get(targetUrl, { 
        timeout: 5000,
        headers: { 'User-Agent': 'CyberDefense-Hub-Security-Scanner/1.0' }
      });
      
      const headers = response.headers;
      const analysis = {
        "Strict-Transport-Security": headers["strict-transport-security"] || "MISSING",
        "Content-Security-Policy": headers["content-security-policy"] || "MISSING",
        "X-Frame-Options": headers["x-frame-options"] || "MISSING",
        "X-Content-Type-Options": headers["x-content-type-options"] || "MISSING",
        "Referrer-Policy": headers["referrer-policy"] || "MISSING",
        "Permissions-Policy": headers["permissions-policy"] || "MISSING",
      };

      res.json({ url: targetUrl, analysis, status: response.status });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to analyze URL", details: error.message });
    }
  });

  // API: Threat Feed Proxy (CISA RSS)
  app.get("/api/threat-feed", async (req, res) => {
    try {
      // Using a JSON version of a threat feed or a simple proxy
      const response = await axios.get("https://www.cisa.gov/sites/default/files/feeds/alerts.json");
      res.json(response.data);
    } catch (error) {
      // Fallback mock data if feed is down
      res.json({
        items: [
          { title: "CISA Adds One Known Exploited Vulnerability to Catalog", date: new Date().toISOString() },
          { title: "Ivanti Releases Security Update for Connect Secure", date: new Date().toISOString() }
        ]
      });
    }
  });

  // API: Real CVE Search (NIST NVD)
  app.get("/api/cve-search", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
      // NIST NVD API v2.0
      // Note: In production, you'd want an API key to avoid rate limits
      const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${query}`, {
        timeout: 10000,
        headers: { 'User-Agent': 'CyberDefense-Hub/1.0' }
      });
      
      const vulnerabilities = response.data.vulnerabilities || [];
      const results = vulnerabilities.slice(0, 10).map((v: any) => ({
        id: v.cve.id,
        description: v.cve.descriptions.find((d: any) => d.lang === 'en')?.value || "No description available.",
        severity: v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || v.cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore || "N/A",
        published: v.cve.published
      }));

      res.json(results);
    } catch (error: any) {
      console.error("CVE Search Error:", error.message);
      res.status(500).json({ error: "Failed to fetch CVE data", details: error.message });
    }
  });

  // API: Global Network Health (Mocking real-world data from multiple sources)
  app.get("/api/network-health", async (req, res) => {
    try {
      // In a real app, you might fetch from Cloudflare Radar or similar
      // Here we provide a realistic "live" feel with dynamic data
      res.json({
        globalStatus: "OPERATIONAL",
        latency: {
          northAmerica: Math.floor(Math.random() * 20) + 10,
          europe: Math.floor(Math.random() * 30) + 40,
          asia: Math.floor(Math.random() * 50) + 120
        },
        activeThreats: Math.floor(Math.random() * 1000) + 500,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch network health" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
