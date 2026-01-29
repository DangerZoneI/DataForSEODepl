import express from 'express';
import { spawn } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SSE endpoint
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Start the dataforseo-mcp-server in stdio mode
  const mcpServer = spawn('npx', ['dataforseo-mcp-server'], {
    env: {
      ...process.env,
      DATAFORSEO_USERNAME: process.env.DATAFORSEO_LOGIN,
      DATAFORSEO_PASSWORD: process.env.DATAFORSEO_PASSWORD
    }
  });
  
  // Forward stdout to SSE
  mcpServer.stdout.on('data', (data) => {
    res.write(`data: ${data.toString()}\n\n`);
  });
  
  mcpServer.stderr.on('data', (data) => {
    console.error('MCP Server Error:', data.toString());
  });
  
  // Handle client disconnect
  req.on('close', () => {
    mcpServer.kill();
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DataForSEO MCP Server running on port ${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
});
