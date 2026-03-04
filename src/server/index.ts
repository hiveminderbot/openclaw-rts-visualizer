import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { ZONES, assignAgentToZone } from '../shared/zones.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Enable JSON parsing
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Serve static files
const publicPath = path.join(__dirname, '../../public');
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Also serve at root
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// API endpoints
app.get('/api/zones', (req, res) => {
  res.json(ZONES);
});

app.get('/api/agents', async (req, res) => {
  try {
    // Get sessions from OpenClaw
    const { stdout } = await execAsync('openclaw sessions list --json 2>/dev/null || echo "[]"');
    const sessions = JSON.parse(stdout);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.json([]);
  }
});

app.get('/api/system', async (req, res) => {
  try {
    // Get system stats
    const { stdout: cpu } = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1");
    const { stdout: mem } = await execAsync("free | grep Mem | awk '{printf \"%.1f\", $3/$2 * 100.0}'");
    
    res.json({
      cpu: parseFloat(cpu) || 0,
      memory: parseFloat(mem) || 0,
      timestamp: Date.now()
    });
  } catch (error) {
    res.json({ cpu: 0, memory: 0, timestamp: Date.now() });
  }
});

// WebSocket for real-time updates
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send initial data
  sendAgentUpdate(ws);
  
  // Poll for updates every 2 seconds
  const interval = setInterval(() => {
    sendAgentUpdate(ws);
  }, 2000);
  
  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
  
  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());
    
    if (data.type === 'command') {
      // Handle commands (kill, spawn, etc)
      try {
        if (data.command === 'kill' && data.sessionKey) {
          await execAsync(`openclaw sessions kill ${data.sessionKey}`);
        }
        ws.send(JSON.stringify({ type: 'success', message: 'Command executed' }));
      } catch (error: any) {
        ws.send(JSON.stringify({ type: 'error', message: error.message }));
      }
    }
  });
});

async function sendAgentUpdate(ws: any) {
  try {
    const { stdout } = await execAsync('openclaw sessions list --json 2>/dev/null || echo "[]"');
    const sessions = JSON.parse(stdout);
    
    // Transform sessions to agent units with zone-based positioning
    const agents = sessions.map((s: any, i: number) => {
      const agent = {
        id: s.sessionKey || `agent-${i}`,
        name: s.label || s.agentId || 'Unknown',
        type: s.kind || 'unknown',
        status: s.active ? 'running' : 'idle',
        health: s.active ? 100 : 50,
        lastActive: s.lastMessageAt,
        ...assignAgentToZone({ type: s.kind, status: s.active ? 'running' : 'idle', label: s.label })
      };
      return agent;
    });
    
    ws.send(JSON.stringify({ type: 'agents', data: agents }));
  } catch (error) {
    console.error('Error sending update:', error);
  }
}

server.listen(PORT, () => {
  console.log(`🎮 OpenClaw RTS Visualizer running on http://localhost:${PORT}`);
  console.log(`📊 WebSocket server ready for connections`);
});
