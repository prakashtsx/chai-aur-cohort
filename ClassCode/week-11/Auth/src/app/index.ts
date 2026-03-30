import express from "express";
import type { Express } from "express";

export function createApplication(): Express {
  const app = express();

  //Routes
  app.get("/health", (req, res) => {
    return res.json("Server is running fine");
  });

  return app;
}
