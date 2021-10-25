const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require('cors');
const { Server: IoServer } = require("socket.io");

// ------------
const { MONGO_URI, PORT, DEBUG, CORS_CLIENT_ORIGINE } = require("./settings");
const middlewares = require("./middlewares");
const routes = require("./routes");
const webSocketMiddlewares = require("./websocket/middlewares");
const listeners = require("./websocket/listeners");
// ----------------------

async function connectDatabase(mongoUri) {
    try {
        await mongoose.connect(mongoUri);
        console.log("--------------------- db connected");
    } catch (err) {
        console.error("--------------------- db error");
        console.log(err);
    }
}

function createExpressServer(port) {
    const app = express();
    // --------
    if (DEBUG) {
        app.use(morgan('combined'));
    }
    app.use(cors({ origin: CORS_CLIENT_ORIGINE, optionsSuccessStatus: 200 }));
    app.use(express.json());
    // -----------------------
    middlewares.map(({ path, mid }) => app.use(path, mid));
    routes.map(({ path, router }) => app.use(path, router));

    return {
        server: app.listen(port, () => {
            console.log(`------------------------ App listening at http://localhost:${port}`);
        }),
        app
    };
}

function createWebSocketIoServer(expressServer, expressApp) {
    const io = new IoServer(expressServer, {
        cors: {
            origins: ["http://localhost:8080", "http://192.168.1.6:8080"],
            methods: ["GET", "POST"]
        }
    });

    // -------------------
    webSocketMiddlewares.map((mid) => io.use(mid));

    io.on(
        "connection",
        (socket) => {
            listeners.map((item) => socket.on(item.event, item.listener(socket)));
            socket.on("disconnect", () => console.log("socket closed"))
        });
    expressApp.set("socketIo", io);
    return io;

}
module.exports = async() => {

    await connectDatabase(MONGO_URI);
    const { server, app } = await createExpressServer(PORT);
    createWebSocketIoServer(server, app);

    return server;
}