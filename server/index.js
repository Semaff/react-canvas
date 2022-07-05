/*
  Imports
*/
require('dotenv').config();
const findRemoveSync = require("find-remove");
const express = require('express');
const epressWS = require('express-ws');
const cors = require('cors');
const router = require('./routes/routes');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

/*
  Config
*/
const PORT = process.env.PORT || 5000;
const app = express();
const WSServer = epressWS(app);
const aWss = WSServer.getWss();

app.use(cors());
app.use(express.json());
app.use(router);

// Error Handler should be placed at the END
app.use(errorHandler);

/*
 Start Server
*/
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

// Delete files older than 24 hours
findRemoveSync(__dirname + '/files', { age: { seconds: 86400 } });

/*
  WebSocket
*/
app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg);
                break;
            case "draw":
                broadcastConnection(ws, msg);
                break;
            case "undo":
            case "redo":
                broadcastConnection(ws, msg);
                break;
        }
    });
});

const connectionHandler = (ws, msg) => {
    ws.id = msg.id;
    broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg));
        }
    })
};