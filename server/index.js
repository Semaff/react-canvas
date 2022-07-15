/*
  Imports
*/
require('dotenv').config();
const findRemoveSync = require("find-remove");
const express = require('express');
const expressWS = require('express-ws');
const cors = require('cors');
const router = require('./routes/routes');
const errorHandler = require('./middleware/errorHandlingMiddleware');

/*
  Config
*/
const PORT = process.env.PORT || 5000;
const app = express();
const WSServer = expressWS(app);
const aWss = WSServer.getWss();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(router);

// Error Handler should be placed at the END
app.use(errorHandler);

/*
 Start Server
*/
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
app.get("/:id", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Delete files older than 24 hours
findRemoveSync(__dirname + '/files', { age: { seconds: 86400 } });

/*
  WebSocket
*/
app.ws('/draw', (ws, req) => {
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