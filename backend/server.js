const express = require('express');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const helmet = require("helmet")
const fs = require('fs').promises;
const fsSync = require("fs");
const pool = require('./config/db')
require('dotenv').config();

const app = express();
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
})

const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
})

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
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/auth", limiterAuth, authRoutes)

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
