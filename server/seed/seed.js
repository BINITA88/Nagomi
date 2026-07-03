require("dotenv").config();
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const MenuItem = require("../models/MenuItem");
const Testimonial = require("../models/Testimonial");
const Setting = require("../models/Setting");

// Load the frontend's data.js so the seed stays in sync with the design's
// current fallback content (single source of truth).
function loadFrontendData() {
  const dataPath = path.join(__dirname, "..", "..", "nagomi", "data.js");
  const code = fs.readFileSync(dataPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return {
    menu: sandbox.window.NAGOMI_MENU || [],
    testimonials: sandbox.window.NAGOMI_TESTIMONIALS || [],
  };
}

// Default site copy taken from the current index.html design.
const DEFAULT_SETTINGS = {
  heroKicker: "Nagomi-ya Sushi",
  heroTitle: "Handcrafted bites, seasonal cuts, and warm rice.",
  heroSubtitle:
    "A Kyoto-inspired sushi bar where every plate is sliced to order. Settle in, let the chef guide the evening, and taste the season at its peak.",
  stat1Value: "12+",
  stat1Label: "Years of craft",
  stat2Value: "4.9★",
  stat2Label: "Guest rating",
  stat3Value: "Daily",
  stat3Label: "Market fish",
  contactEmail: "hello@nagomi-ya.com",
  contactPhone: "+1 (555) 014-2233",
  address: "41 Riverside Walk, Kyoto Quarter",
  hours: "Tue–Sun · 5pm – 10:30pm",
  footerTagline: "Kyoto-inspired sushi bar. Handcrafted bites, seasonal cuts, and warm rice.",
};

async function run() {
  const force = process.argv.includes("--force");
  await connectDB();

  const { menu, testimonials } = loadFrontendData();

  // ----- Menu -----
  const menuCount = await MenuItem.countDocuments();
  if (menuCount > 0 && !force) {
    console.log(`• Skipping menu — ${menuCount} items already exist (use --force to reset).`);
  } else {
    if (force) await MenuItem.deleteMany({});
    const docs = menu.map((m, i) => ({
      slug: m.id,
      title: m.title,
      category: m.category,
      price: m.price || "",
      special: !!m.special,
      tagline: m.tagline || "",
      description: m.description || "",
      longDescription: m.longDescription || "",
      ingredients: m.ingredients || [],
      prepTime: m.prepTime || "",
      calories: m.calories || "",
      chefNote: m.chefNote || "",
      image: m.image || "",
      sortOrder: i,
    }));
    await MenuItem.insertMany(docs);
    console.log(`✓ Seeded ${docs.length} menu items.`);
  }

  // ----- Testimonials -----
  const tCount = await Testimonial.countDocuments();
  if (tCount > 0 && !force) {
    console.log(`• Skipping testimonials — ${tCount} already exist (use --force to reset).`);
  } else {
    if (force) await Testimonial.deleteMany({});
    const docs = testimonials.map((t, i) => ({
      name: t.name,
      role: t.role || "",
      rating: t.rating || 5,
      quote: t.quote || "",
      image: t.image || "",
      sortOrder: i,
    }));
    await Testimonial.insertMany(docs);
    console.log(`✓ Seeded ${docs.length} testimonials.`);
  }

  // ----- Settings -----
  const sCount = await Setting.countDocuments();
  if (sCount > 0 && !force) {
    console.log(`• Skipping settings — ${sCount} already exist (use --force to reset).`);
  } else {
    if (force) await Setting.deleteMany({});
    await Promise.all(
      Object.entries(DEFAULT_SETTINGS).map(([key, value]) =>
        Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true })
      )
    );
    console.log(`✓ Seeded ${Object.keys(DEFAULT_SETTINGS).length} settings.`);
  }

  await mongoose.disconnect();
  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
