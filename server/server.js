const HTTPS_PORT = 3000;

const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const mysql = require('mysql');

// Connect to MySQL
var con = mysql.createConnection({
  host: "localhost",
  user: "nodejs-chat",
  password: "nodejs_is_fUn",
  database: "nodejs_chat"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});


// Yes, TLS is required
const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

// ----------------------------------------------------------------------------------------

// Create a server for the client html page
const handleRequest = function(request, response) {
  // Render the single client html file for any request the HTTP server receives
  console.log('request received: ' + request.url);

  if(request.url === '/') {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(fs.readFileSync('client/index.html'));
  } else if(request.url === '/login.js') {
    response.writeHead(200, {'Content-Type': 'application/javascript'});
    response.end(fs.readFileSync('client/login.js'));
  } else if(request.url === '/chat.html') {
    response.writeHead(200, {'Content-Type': 'application/javascript'});
    response.end(fs.readFileSync('client/chat.html'));
  } else if(request.url === '/webrtc.js') {
    response.writeHead(200, {'Content-Type': 'application/javascript'});
    response.end(fs.readFileSync('client/webrtc.js'));
  }
};

const httpsServer = https.createServer(serverConfig, handleRequest);
httpsServer.listen(HTTPS_PORT, '0.0.0.0');

// ----------------------------------------------------------------------------------------

// Create a server for handling websocket calls
const wss = new WebSocketServer({server: httpsServer});

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    // Broadcast any received message to all clients
    console.log('received: %s', message);
    wss.broadcast(message);
  });
});

wss.broadcast = function(data) {
  this.clients.forEach(function(client) {
    if(client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

console.log('Server running on port 3000...');
