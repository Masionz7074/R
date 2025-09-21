import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".mcaddon", ".mcpack", ".mcworld", ".mctemplate"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Only Minecraft files allowed!"));
    }
  }
});

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// List files endpoint
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const list = files.map(f => ({
      name: f,
      url: `/uploads/${f}`
    }));
    res.json(list);
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
