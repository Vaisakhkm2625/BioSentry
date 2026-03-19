import { spawn } from 'child_process';

const mcp = spawn('npx', ['-y', '@sveltejs/mcp']);

mcp.stdout.on('data', (d) => {
    const lines = d.toString().split('\n').filter(l => l.trim() !== '');
    lines.forEach(line => {
        try {
            const parsed = JSON.parse(line);
            console.log('> ' + JSON.stringify(parsed, null, 2));
        } catch {
            console.log('raw:', line);
        }
    });
});

let id = 1;

function send(req) {
    req.jsonrpc = "2.0";
    req.id = id++;
    const msg = JSON.stringify(req) + '\n';
    mcp.stdin.write(msg);
}

// 1. Initialize
send({
    method: "initialize",
    params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test", version: "1.0" }
    }
});

setTimeout(() => {
    send({ method: "notifications/initialized" });
    send({ method: "tools/list" });
    send({ method: "resources/list" });
}, 1000);

setTimeout(() => mcp.kill(), 3000);
