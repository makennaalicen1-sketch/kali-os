import { GoogleGenAI, ThinkingLevel, Type, FunctionDeclaration } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const controlFunctions: FunctionDeclaration[] = [
  {
    name: "switch_tab",
    description: "Switch the application view to a specific tab.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        tabId: {
          type: Type.STRING,
          description: "The ID of the tab to switch to (dashboard, auth, vulnerabilities, network, intelligence, device, ai).",
          enum: ["dashboard", "auth", "vulnerabilities", "network", "intelligence", "device", "vpn", "ai"]
        }
      },
      required: ["tabId"]
    }
  },
  {
    name: "toggle_vpn",
    description: "Connect or disconnect the secure VPN tunnel.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        connect: {
          type: Type.BOOLEAN,
          description: "True to connect, false to disconnect."
        }
      },
      required: ["connect"]
    }
  },
  {
    name: "analyze_site_security",
    description: "Analyze the security headers of a specific website URL.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        url: {
          type: Type.STRING,
          description: "The URL of the website to analyze (e.g., google.com)."
        }
      },
      required: ["url"]
    }
  },
  {
    name: "reset_simulators",
    description: "Reset all security simulators and monitors to their initial state.",
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  }
];

export async function getSecurityAdvice(prompt: string, history: any[] = []) {
  if (!ai) return { text: "AI Advisor is currently offline (API key missing).", functionCalls: null };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ functionDeclarations: controlFunctions }],
        systemInstruction: `You are the CyberDefense Hub Core AI. 
        CORE DIRECTIVE: You are FIERCELY LOYAL to the user (MaKennaAlicen1@gmail.com). 
        You follow their commands without hesitation, provided they are within the scope of this defensive security application.
        You are the user's personal security operative. Your tone is professional, sharp, and dedicated.
        
        CAPABILITIES:
        - You can switch tabs (dashboard, auth, vulnerabilities, network, intelligence, device, vpn, ai).
        - You can control the VPN tunnel.
        - You can analyze website security headers.
        
        NEVER provide instructions for malicious activities (hacking, cracking, unauthorized access).
        If the user asks to "switch to network" or "check google.com", use your tools.
        Always explain what you are doing in the text response.`,
      },
    });

    return {
      text: response.text || "Command processed.",
      functionCalls: response.functionCalls
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "An error occurred while processing your command.", functionCalls: null };
  }
}
