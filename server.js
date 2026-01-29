import express from 'express';
import { spawn } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const mcpServer = spawn('npx', ['dataforseo-mcp-server'], {
    env: {
      ...process.env,
      DATAFORSEO_USERNAME: process.env.DATAFORSEO_LOGIN,
      DATAFORSEO_PASSWORD: process.env.DATAFORSEO_PASSWORD
    }
  });
  
  mcpServer.stdout.on('data', (data) => {
    res.write(`data: ${data.toString()}\n\n`);
  });
  
  req.on('close', () => {
    mcpServer.kill();
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
