// env
require("dotenv").config();

const express = require("express");
const router = require("./src/routers");
const cors = require("cors");

const app = express();

// port
const port = 5000;

// Socket IO
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

require("./src/socket")(io);

// JSON
app.use(express.json());

// CORS
app.use(cors());

// URL API
app.use("/api/dumbgram/v1/", router);

// ImageFile
app.use("/uploads", express.static("uploads"));

// Server listen
server.listen(port, () => console.log(`Server running on port ${port}`));
