import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();

// MiddleWares
app.use(
  rateLimit({
    limit: 100,
    windowMs: 5 * 60 * 1000,
    message: "Too many requests. Please try again later",
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Test Route
app.get("/test", (req, res) => {
  return res.json({ success: "true" });
});

//Error Res Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: err.stack || undefined,
  });
});

export default app;
