const { WebSocketServer } = require('ws');


//stores the websocket stuff
const clients = new Set();


function initWebsocket(server) {
    const wss = new WebSocketServer({ server });

    was.on('connection', (ws) => {
        clients.add(ws);
        console.log(`WebSocket client connected. Total: ${clients.size}`)

        ws.send(JSON.stringify({
            type: 'system',
            message: "Connected to Schedule and Goals pages and their live updates.", 
        }));

        ws.on('message', (rawData) => {
            console.log('Received from client:', rawData.toString());
        });

        ws.on('close', () => {
            clients.delete(ws);
            console.log(`Websocket client disconnected. Total: ${clients.size}`);
        });

        ws.on('error', (err) => {
            console.error('Websocket error:', err) ;
            clients.delete(ws);
        });

    });

    console.log('Websocket server initialized');

}


//broadcasts message to everybody
function broadcast(payload) {
    const data = JSON.stringify(payload);
    for (const ws of clients) {
        if (ws.readyState === ws.OPEN) {
            ws.send(data);
        }
    }
}



//Thing for calling goals
function broadcastGoalEvent(type, goal) {
    broadcast({ type, goal });
}

function broadcastActivity(message) {
    broadcast({ type:'activity', message})
}

module.exports = { initWebsocket, broadcastGoalEvent, boradcastActivity};