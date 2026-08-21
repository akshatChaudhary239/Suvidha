import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { publicApiLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";

const app = express();

app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(publicApiLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Suvidha API", time: new Date() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(env.PORT, () => {
  console.log(`[Suvidha API] Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
