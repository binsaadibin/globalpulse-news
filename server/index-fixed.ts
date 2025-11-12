import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Add CORS for production
app.use(cors({
  origin: ['https://your-app.netlify.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Your existing middleware and routes...

(async () => {
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  }
  // Comment out serveStatic for production - frontend will be on Netlify
  // else {
  //   serveStatic(app);
  // }

  const port = parseInt(process.env.PORT || '5000', 10);
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
