// Shared menu data for Nagomi-ya Sushi.
// Used by the landing page, the full menu page, and dish detail pages.
//
// These arrays are the FALLBACK content. On load, the site tries to fetch
// live data from the backend (see config.js / window.NAGOMI_API_BASE). If the
// backend is reachable and has data, it overrides these; otherwise the site
// keeps working with the built-in values below.
window.NAGOMI_MENU_FALLBACK = [
  {
    id: "yuzu-hamachi",
    title: "Yuzu Hamachi",
    category: "Sashimi",
    price: "$14",
    special: false,
    tagline: "Citrus-bright yellowtail, sliced to order.",
    description: "Yellowtail sashimi with yuzu soy, micro shiso, and citrus oil.",
    longDescription:
      "Line-caught yellowtail rested on ice and sliced à la minute, then dressed with a bright yuzu-soy ponzu. Finished with micro shiso and a thread of cold-pressed citrus oil for a clean, mountain-air finish.",
    ingredients: ["Yellowtail", "Yuzu", "Soy", "Micro shiso", "Citrus oil"],
    prepTime: "10 min",
    calories: "210 kcal",
    chefNote: "Best enjoyed first, while the cut is at its coldest.",
    image: "public/FOOD1.png",
  },
  {
    id: "nagomi-nigiri-set",
    title: "Nagomi Nigiri Set",
    category: "Nigiri",
    price: "$18",
    special: true,
    tagline: "Six seasonal cuts over warm, vinegared rice.",
    description: "Chef selection of six seasonal nigiri with warm rice.",
    longDescription:
      "Our signature progression of six nigiri, chosen each morning from the day's best fish. Each piece is pressed over warm akazu rice and brushed with house nikiri so it arrives perfectly seasoned.",
    ingredients: ["Seasonal fish", "Akazu rice", "Nikiri glaze", "Fresh wasabi"],
    prepTime: "15 min",
    calories: "430 kcal",
    chefNote: "Eat in the order served — light to rich.",
    image: "public/FOOD2.png",
  },
  {
    id: "charcoal-miso-cod",
    title: "Charcoal Miso Cod",
    category: "Hot Plates",
    price: "$16",
    special: true,
    tagline: "Three-day miso marinade, charcoal-finished.",
    description: "Black cod glazed in white miso, served with pickled ginger.",
    longDescription:
      "Black cod cured for three days in sweet Saikyo white miso, then finished over binchotan charcoal until the glaze caramelises and the flesh flakes into silken petals. Served with house pickled ginger.",
    ingredients: ["Black cod", "Saikyo miso", "Sake", "Pickled ginger"],
    prepTime: "20 min",
    calories: "380 kcal",
    chefNote: "The caramelised edge is the best bite — don't leave it.",
    image: "public/FOOD3.png",
  },
  {
    id: "garden-tempura",
    title: "Garden Tempura",
    category: "Starters",
    price: "$12",
    special: false,
    tagline: "Feather-light batter, smoked sea salt.",
    description: "Crisp seasonal vegetables, tentsuyu, and smoked sea salt.",
    longDescription:
      "A basket of the season's vegetables in our cold, sparkling tempura batter, fried so light it shatters. Served with warm tentsuyu dipping broth and a pinch of cherrywood-smoked sea salt.",
    ingredients: ["Seasonal vegetables", "Tempura batter", "Tentsuyu", "Smoked salt"],
    prepTime: "12 min",
    calories: "260 kcal",
    chefNote: "Try a piece with just the smoked salt first.",
    image: "public/FOOD4.png",
  },
  {
    id: "tokyo-sunset-roll",
    title: "Tokyo Sunset Roll",
    category: "Rolls",
    price: "$15",
    special: false,
    tagline: "Spicy tuna inside, torched salmon on top.",
    description: "Spicy tuna, avocado, and torch-seared salmon.",
    longDescription:
      "Spicy tuna and avocado rolled tight, crowned with torch-seared salmon and a brush of sweet-smoky glaze. A warm-cool contrast that gives the roll its sunset name.",
    ingredients: ["Tuna", "Avocado", "Salmon", "Spicy mayo", "Unagi glaze"],
    prepTime: "14 min",
    calories: "490 kcal",
    chefNote: "The sear is done table-side on request.",
    image: "public/FOOD5.png",
  },
  {
    id: "shiso-cucumber-maki",
    title: "Shiso Cucumber Maki",
    category: "Rolls",
    price: "$9",
    special: false,
    tagline: "Cool, herbaceous, and refreshing.",
    description: "Cucumber, shiso, and sesame wrapped in nori.",
    longDescription:
      "Crisp cucumber batons and fragrant shiso leaf rolled with toasted sesame in crisp nori. A clean, refreshing maki that resets the palate between richer plates.",
    ingredients: ["Cucumber", "Shiso", "Toasted sesame", "Nori", "Sushi rice"],
    prepTime: "10 min",
    calories: "180 kcal",
    chefNote: "Lovely as a palate cleanser mid-meal.",
    image: "public/FOOD6.png",
  },
  {
    id: "matcha-mochi",
    title: "Matcha Mochi",
    category: "Dessert",
    price: "$8",
    special: false,
    tagline: "Soft mochi, matcha cream, kinako dust.",
    description: "Soft mochi filled with matcha cream and kinako dust.",
    longDescription:
      "Hand-pounded mochi wrapped around a cloud of ceremonial-grade matcha cream, dusted with roasted soybean kinako for a nutty finish. Made in small batches throughout service.",
    ingredients: ["Mochi", "Ceremonial matcha", "Cream", "Kinako"],
    prepTime: "8 min",
    calories: "240 kcal",
    chefNote: "Pairs beautifully with our genmaicha.",
    image: "public/FOOD7.png",
  },
  {
    id: "kyoto-spritz",
    title: "Kyoto Spritz",
    category: "Drinks",
    price: "$10",
    special: false,
    tagline: "Yuzu soda meets jasmine tea.",
    description: "Yuzu soda, jasmine tea syrup, and sparkling citrus.",
    longDescription:
      "Fresh yuzu soda lengthened with house jasmine-tea syrup and sparkling citrus over clear ice. Floral, bittersweet, and endlessly drinkable. Available with or without a splash of sake.",
    ingredients: ["Yuzu", "Jasmine tea syrup", "Soda", "Citrus"],
    prepTime: "5 min",
    calories: "120 kcal",
    chefNote: "Ask for the sake float for an aperitif.",
    image: "public/FOOD8.png",
  },
  {
    id: "truffle-uni-toast",
    title: "Truffle Uni Toast",
    category: "Chef Specials",
    price: "$19",
    special: true,
    tagline: "Sea urchin, brioche, white truffle.",
    description: "Brioche toast, sea urchin, and white truffle oil.",
    longDescription:
      "Buttery brioche toasted golden, layered with cold sea urchin and finished with shaved nori and a generous drizzle of white truffle oil. The kitchen's most-requested indulgence.",
    ingredients: ["Brioche", "Sea urchin", "White truffle oil", "Nori"],
    prepTime: "12 min",
    calories: "310 kcal",
    chefNote: "Limited each evening — reserve when you book.",
    image: "public/FOOD9.png",
  },
];

window.NAGOMI_TESTIMONIALS_FALLBACK = [
  {
    name: "Amelia R.",
    role: "Food Writer",
    rating: 5,
    quote:
      "Every cut arrives at its peak. The Nagomi Nigiri Set is the most precise sushi I've had outside Kyoto.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "James K.",
    role: "Regular Guest",
    rating: 5,
    quote:
      "The charcoal miso cod is worth the trip alone. Warm rice, calm room, faultless service.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Priya S.",
    role: "Local Critic",
    rating: 5,
    quote:
      "A delicate balance of citrus and umami. The yuzu hamachi tasted like it was sliced for me alone.",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Oliver P.",
    role: "Anniversary Dinner",
    rating: 5,
    quote:
      "Booked for our anniversary and left planning the next visit. The truffle uni toast is unforgettable.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Hana T.",
    role: "First-time Visitor",
    rating: 5,
    quote:
      "Walked in curious, walked out a regular. The matcha mochi is made fresh and you can tell.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
];

// ─────────────────────────────────────────────────────────────
//  Live data loader (with fallback)
//
//  Sets window.NAGOMI_MENU / NAGOMI_TESTIMONIALS / NAGOMI_SETTINGS
//  to the fallback immediately, then tries to override them from the
//  backend. Consumers should wait on window.NAGOMI_READY before
//  rendering so they get live data when it's available.
// ─────────────────────────────────────────────────────────────
(function () {
  // Start from the built-in fallback so the site works even offline.
  window.NAGOMI_MENU = window.NAGOMI_MENU_FALLBACK;
  window.NAGOMI_TESTIMONIALS = window.NAGOMI_TESTIMONIALS_FALLBACK;
  window.NAGOMI_SETTINGS = {};

  var API_BASE = (window.NAGOMI_API_BASE || "").replace(/\/$/, "");

  function fetchJSON(path) {
    return fetch(API_BASE + path, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  window.NAGOMI_READY = (function () {
    // No backend configured → keep fallbacks.
    if (!API_BASE) return Promise.resolve();

    return Promise.allSettled([
      fetchJSON("/api/menu"),
      fetchJSON("/api/testimonials"),
      fetchJSON("/api/settings"),
    ])
      .then(function (results) {
        var menu = results[0];
        var testimonials = results[1];
        var settings = results[2];

        if (menu.status === "fulfilled" && Array.isArray(menu.value) && menu.value.length) {
          window.NAGOMI_MENU = menu.value;
        }
        if (
          testimonials.status === "fulfilled" &&
          Array.isArray(testimonials.value) &&
          testimonials.value.length
        ) {
          window.NAGOMI_TESTIMONIALS = testimonials.value;
        }
        if (
          settings.status === "fulfilled" &&
          settings.value &&
          typeof settings.value === "object"
        ) {
          window.NAGOMI_SETTINGS = settings.value;
        }
      })
      .catch(function () {
        // Any unexpected error → keep whatever fallbacks are in place.
      });
  })();
})();
