import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      company: "Gohar Group for Real Estate Development",
      timestamp: new Date().toISOString(),
    });
  });

  // Backup sync mock API endpoint
  app.post("/api/cloud-sync", (req, res) => {
    res.json({
      success: true,
      provider: "Google Drive",
      syncedAt: new Date().toISOString(),
      message: "Data synced successfully with Gohar Group Cloud Drive",
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gohar Group CRM Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Gohar Group CRM Server:", err);
});
