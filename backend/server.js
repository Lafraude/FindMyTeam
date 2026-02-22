const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require('cors');
const pool = require('./config/db');

require('dotenv').config();

const app = express();
const PORT = 3000;
const PORT_SOCKET = 3001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.set('io', io);
io.on('connection', (socket) => {
  console.log('Un utilisateur connecté:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} a rejoint la room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
  });
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
const limiterAuth = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(limiter);
app.use(express.json({ limit: "10kb" }));

const authRoutes = require("./routes/auth.routes");
app.use("/auth", limiterAuth, authRoutes);

app.listen(PORT, () => console.log(`Serveur Express démarré sur http://localhost:${PORT}`));
server.listen(PORT_SOCKET, () => console.log(`Server Socket.IO démarré sur http://localhost:${PORT_SOCKET}`));