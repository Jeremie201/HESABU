const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const googleRoutes =
  require("./routes/googleRoutes");

require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const devisRoutes = require("./routes/devisRoutes");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Trop de requêtes, réessayez plus tard."
  }
});

// Middlewares
app.use(helmet());

app.use(morgan("dev"));

app.use(limiter);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://hesaburdc.com",
      "https://www.hesaburdc.com"
    ],
    credentials: true
  })
);

app.use(express.json());

// Route principale
app.get("/", (req, res) => {
  res.json({
    company: "HESABU SARLU",
    status: "API ONLINE",
  });
});

// Test PostgreSQL
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW()"
    );

    res.json({
      success: true,
      database: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Routes API
app.use("/api/auth", authRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/devis", devisRoutes);

app.use("/api/google", googleRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Serveur démarré sur le port ${PORT}`
  );
});
