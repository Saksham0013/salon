import dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDatabase from "./config/database.js";
import appointmentRoutes from "./routes/appointments.js";
import contactRoutes from "./routes/contact.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("PORT =", process.env.PORT);
console.log("CLIENT_URL =", process.env.CLIENT_URL);
console.log("SMTP_HOST =", process.env.SMTP_HOST || "Not Set");
console.log(
  "MONGODB_URI =",
  process.env.MONGODB_URI ? "Loaded ✅" : "Missing ❌"
);

const app = express();

const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

try {
  await connectDatabase();
} catch (err) {
  console.error("❌ MongoDB Connection Failed");
  console.error(err.message);
}

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              "https://fonts.googleapis.com",
            ],
            fontSrc: [
              "'self'",
              "https://fonts.gstatic.com",
            ],
            imgSrc: [
              "'self'",
              "data:",
              "https://images.unsplash.com",
            ],
            frameSrc: [
              "https://maps.google.com",
            ],
            connectSrc: [
              "'self'",
              process.env.CLIENT_URL,
            ],
          },
        }
      : false,
  })
);

/* ===========================
   CORS
=========================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* =========================== */

app.use(express.json({ limit: "1mb" }));

app.use(morgan(isProduction ? "combined" : "dev"));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "luxe-salon-api",
  });
});

app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);

if (isProduction) {
  const clientDist = path.resolve(__dirname, "../../client/dist");

  app.use(express.static(clientDist));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Luxe Salon API listening on http://localhost:${port}`);
});