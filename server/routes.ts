import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertCheckboxStateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // Get all checkbox states
  app.get("/api/checkboxes", async (_req, res) => {
    const states = await storage.getCheckboxStates();
    res.setHeader('ngrok-skip-browser-warning', 'true');
    res.json(states);
  });

  // Update checkbox state
  app.post("/api/checkboxes/:id", async (req, res) => {
    const { id } = req.params;
    const { checked } = req.body;

    try {
      const state = insertCheckboxStateSchema.parse({ id: parseInt(id), checked });
      const updatedState = await storage.updateCheckboxState(state);
      
      // Broadcast update to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ id: updatedState.id, checked: updatedState.checked }));
        }
      });

      res.json(updatedState);
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
    }
  });

  return httpServer;
}
