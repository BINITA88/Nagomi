require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { uploadDir } = require("./middleware/upload");

const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const testimonialRoutes = require("./routes/testimonials");
const settingsRoutes = require("./routes/settings");
const uploadRoutes = require("./routes/uploads");

const app = express();
const PORT = process.env.PORT || 4000;

// ----- CORS -----
const origins = (process.env.CORS_ORIGINS || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: origins.includes("*") ? true : origins,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ----- Static assets -----
app.use("/uploads", express.static(uploadDir));
app.use("/admin", express.static(path.join(__dirname, "public", "admin")));

// ----- API routes -----
app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/uploads", uploadRoutes);

// Root redirect to the admin panel for convenience.
app.get("/", (req, res) => res.redirect("/admin"));

// ----- Error handler -----
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Nagomi admin server running on http://localhost:${PORT}`);
      console.log(`  Admin panel:  http://localhost:${PORT}/admin`);
      console.log(`  Public API:   http://localhost:${PORT}/api/menu`);
    });
  })
  .catch((err) => {
    console.error("✗ Failed to start — could not connect to MongoDB:");
    console.error(`  ${err.message}`);
    console.error("  Check MONGODB_URI in your .env file and that MongoDB is running.");
    process.exit(1);
  });
