const express = require('express');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require("fs");
require('dotenv').config();

const app = express();
const PORT = 3000;

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 600
});

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT"],
}));

app.use(limiter);
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
