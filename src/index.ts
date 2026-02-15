import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
const app = express();
const prisma = new PrismaClient();
app.use(cors());
const upload = multer({ dest: "./uploads" });
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.post("/api/videos/upload", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  const video = await prisma.video.create({
    data: { title: req.body.title || req.file.originalname, filePath: req.file.path, status: "UPLOADED" }
  });
  res.json({ success: true, video: { id: video.id, title: video.title } });
});
app.get("/api/videos", async (req, res) => {
  const videos = await prisma.video.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ videos });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server on port", PORT));
