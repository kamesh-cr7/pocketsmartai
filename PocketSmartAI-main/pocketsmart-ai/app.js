// PocketSmart AI - Core Application Engine

// --- Sample Curated Presets ---
const PRESETS = {
  home: [
    {
      id: "living-room-50k",
      title: "1BHK Living Room Revamp",
      budget: 50000,
      description: "Complete living room setup with 3-seater sofa, smart lights, BLDC fan, coffee table & rug.",
      prompt: "Modern living room revamp with 3-seater fabric sofa, ambient smart lighting, energy-saving BLDC ceiling fan, minimalist coffee table, and cozy area rug."
    },
    {
      id: "studio-35k",
      title: "Compact Studio Setup",
      budget: 35000,
      description: "Ergonomic study desk, warm task lighting, storage shelf, and high-speed ceiling fan.",
      prompt: "Compact studio apartment nook with ergonomic study desk, ergonomic chair, warm task lighting, modular bookshelf, and wall art."
    },
    {
      id: "balcony-15k",
      title: "Cozy Balcony Garden & Cafe",
      budget: 15000,
      description: "Weatherproof bistro table set, outdoor fairy lights, vertical planters, and artificial grass turf.",
      prompt: "Charming balcony setup with foldable 2-chair bistro set, waterproof fairy string lights, planter stand with pots, and 4x6 ft artificial green grass turf."
    }
  ],
  party: [
    {
      id: "birthday-30k",
      title: "25th Rooftop Birthday Bash",
      budget: 30000,
      partyType: "Birthday Party",
      guests: 25,
      venueType: "Rooftop / Terrace",
      description: "Terrace celebration for 25 friends with appetizer buffet, fairy lights, custom cake, and DJ speaker.",
      prompt: "25th Birthday party for 25 friends on a private rooftop terrace with finger foods, custom photo cake, helium balloons, Bluetooth party speaker, and mocktail bar."
    },
    {
      id: "anniversary-18k",
      title: "Intimate Dinner Gathering",
      budget: 18000,
      partyType: "Anniversary Celebration",
      guests: 12,
      venueType: "Private Dining Space",
      description: "Fine dining celebration for 12 guests with 3-course dinner, floral table decor, and customized gifts.",
      prompt: "Intimate wedding anniversary dinner for 12 guests with 3-course Indian feast, personalized return gifts, fresh flower arrangements, and acoustic background playlist."
    },
    {
      id: "housewarming-60k",
      title: "Festive Housewarming Event",
      budget: 60000,
      partyType: "Housewarming (Griha Pravesh)",
      guests: 40,
      venueType: "Residential Apartment",
      description: "Traditional catering for 40 guests, marigold entrance decor, brass diyas, and traditional sweets gift boxes.",
      prompt: "Traditional Griha Pravesh housewarming lunch for 40 relatives with South/North Indian thali catering, marigold toran entrance decor, brass diyas, and sweet boxes."
    }
  ],
  jewelry: [
    {
      id: "silk-saree-25k",
      title: "Festive Silk Saree Pairing",
      budget: 25000,
      outfitColors: "Emerald Green & Temple Gold Border",
      outfitStyle: "Ethnic",
      formality: "Festive",
      description: "Temple jewelry choker necklace, jhumka earrings, brass kadas, and gold-finish analog watch.",
      prompt: "Festive Diwali or wedding guest look pairing with rich emerald green Kanjivaram silk saree with antique gold zari border."
    },
    {
      id: "cocktail-18k",
      title: "Indo-Western Cocktail Night",
      budget: 18000,
      outfitColors: "Midnight Blue & Silver Sequins",
      outfitStyle: "Modern",
      formality: "Semi-Formal",
      description: "Sterling silver zircon necklace, drop earrings, tennis bracelet, and sleek minimalist ring.",
      prompt: "Glamorous evening cocktail saree or gown in midnight blue with silver crystal and zircon accents."
    },
    {
      id: "daily-office-12k",
      title: "Minimalist Workwear Essentials",
      budget: 12000,
      outfitColors: "Pastel Linen Beige & White",
      outfitStyle: "Minimalist",
      formality: "Formal",
      description: "14K gold plated dainty pendant, freshwater pearl studs, delicate stackable ring, and leather watch.",
      prompt: "Clean corporate daily wear jewelry suitable for meetings and everyday office elegance in neutral tones."
    }
  ]
};

// --- Application State ---
const state = {
  currentDomain: "home",
  totalBudget: 50000,
  userPrompt: "",
  partyType: "Birthday Party",
  numGuests: 25,
  venueType: "Rooftop Terrace",
  outfitColors: "Emerald Green & Antique Gold",
  outfitStyle: "Ethnic",
  outfitFormality: "Festive",
  uploadedImage: null,
  currentPlan: null,
  isGenerating: false,
  savedPlans: []
};

// Load saved plans from localStorage
try {
  const saved = localStorage.getItem("pocketsmart_saved_plans");
  if (saved) {
    state.savedPlans = JSON.parse(saved);
  }
} catch (e) {
  console.warn("Could not load saved plans:", e);
}

// Format Currency in INR
function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

// Generate high intent platform search URL
function getPlatformSearchUrl(platform, query) {
  const q = encodeURIComponent(query);
  switch (platform.toLowerCase()) {
    case "amazon":
      return `https://www.amazon.in/s?k=${q}`;
    case "flipkart":
      return `https://www.flipkart.com/search?q=${q}`;
    case "ikea":
      return `https://www.ikea.com/in/en/search/?q=${q}`;
    case "swiggy":
      return `https://www.swiggy.com/search?query=${q}`;
    case "zomato":
      return `https://www.zomato.com/search?q=${q}`;
    case "bookmyshow":
      return `https://in.bookmyshow.com/explore/events`;
    case "tanishq":
      return `https://www.tanishq.co.in/shop/${q}`;
    case "caratlane":
      return `https://www.caratlane.com/search/${q}`;
    case "meesho":
      return `https://www.meesho.com/search?q=${q}`;
    default:
      return `https://www.google.com/search?q=${q}`;
  }
}

// --- Dynamic Budget-Conscious Indian Market Generation Engine ---
function generateLocalPlan(domain, budget, requirements) {
  budget = Number(budget) || 10000;
  
  if (domain === "home") {
    // Categories: furniture, lighting, ceiling_fans, misc, dining_tables
    const furnitureAlloc = Math.round(budget * 0.52);
    const lightingAlloc = Math.round(budget * 0.15);
    const fanAlloc = Math.round(budget * 0.13);
    const miscAlloc = Math.round(budget * 0.13);
    const totalAlloc = furnitureAlloc + lightingAlloc + fanAlloc + miscAlloc;
    const remaining = Math.max(0, budget - totalAlloc);

    // Realistic item scaling based on budget
    const isBudgetHigh = budget >= 80000;
    const isBudgetLow = budget <= 25000;

    const sofaCost = Math.round(furnitureAlloc * 0.58);
    const tableCost = Math.round(furnitureAlloc * 0.18);
    const chairCost = furnitureAlloc - sofaCost - tableCost;

    const mainLightCost = Math.round(lightingAlloc * 0.55);
    const floorLampCost = lightingAlloc - mainLightCost;

    const ceilingFanCost = fanAlloc;

    const rugCost = Math.round(miscAlloc * 0.60);
    const decorCost = miscAlloc - rugCost;

    const plan = {
      planner_type: "home",
      total_budget: budget,
      remaining_budget: remaining,
      budget_breakdown: [
        {
          category: "furniture",
          allocation: furnitureAlloc,
          items: [
            {
              name: isBudgetHigh ? "Solimo 3 Seater Fabric Recliner Sofa" : (isBudgetLow ? "Bharat Lifestyle 2 Seater Compact Sofa" : "Wakefit 3 Seater Fabric Sofa Grey"),
              description: "Comfortable high-density foam cushioning with stain-resistant fabric tailored for modern living.",
              estimated_price: sofaCost,
              quantity: 1,
              search_terms: "Wakefit 3 seater fabric sofa modern grey Amazon India"
            },
            {
              name: isBudgetHigh ? "Solid Sheesham Wood Coffee Table with Drawers" : "IKEA LACK Coffee Table Modern Finish",
              description: "Minimalist coffee table with durable finish and lower storage shelf for magazines.",
              estimated_price: tableCost,
              quantity: 1,
              search_terms: "IKEA LACK coffee table black brown IKEA India"
            },
            {
              name: isBudgetHigh ? "Solid Wood Accent Armchair with Velvet Cushion" : "DeckUp Plank Engineered Wood Bookcase and Display Unit",
              description: "Multipurpose display shelving unit for books, decor accessories, and indoor planters.",
              estimated_price: chairCost,
              quantity: 1,
              search_terms: "DeckUp Plank 4 tier engineered wood display rack Flipkart"
            }
          ]
        },
        {
          category: "lighting",
          allocation: lightingAlloc,
          items: [
            {
              name: "Philips Wiz Smart LED Warm White Ceiling Downlights (Set of 4)",
              description: "Dimmable smart Wi-Fi recessed downlights for ambient living room illumination with phone control.",
              estimated_price: mainLightCost,
              quantity: 1,
              search_terms: "Philips Wiz 10W smart recessed downlight pack of 4 Amazon India"
            },
            {
              name: "Crosscut Furniture Wooden Tripod Floor Lamp with Linen Shade",
              description: "Nordic style standing corner floor lamp casting gentle ambient golden glow.",
              estimated_price: floorLampCost,
              quantity: 1,
              search_terms: "Crosscut tripod wooden floor lamp with shade Amazon India"
            }
          ]
        },
        {
          category: "ceiling_fans",
          allocation: fanAlloc,
          items: [
            {
              name: "Atomberg Renesa 1200mm BLDC Motor Ceiling Fan with Smart Remote",
              description: "Energy-efficient 28W brushless DC motor fan saving up to ₹1,500 annually with whisper-quiet operation.",
              estimated_price: ceilingFanCost,
              quantity: 1,
              search_terms: "Atomberg Renesa 1200mm BLDC ceiling fan matte black Amazon India"
            }
          ]
        },
        {
          category: "misc",
          allocation: miscAlloc,
          items: [
            {
              name: "Status Contract Polypropylene Geometric Area Rug (4x6 Feet)",
              description: "Anti-skid soft short-pile living room carpet in neutral cream and grey accents.",
              estimated_price: rugCost,
              quantity: 1,
              search_terms: "Status Contract 4x6 feet geometric carpet area rug Amazon India"
            },
            {
              name: "Urban Space Blackout Eyelet Window Curtains Pair (7 Feet)",
              description: "Thermal insulated solid weave door and window drape set with stainless steel eyelets.",
              estimated_price: decorCost,
              quantity: 1,
              search_terms: "Urban Space 7 feet blackout curtains pair grey Amazon India"
            }
          ]
        }
      ],
      calculation_table: [
        {
          category: "furniture",
          items_count: 3,
          total_cost: furnitureAlloc,
          percentage_of_budget: Math.round((furnitureAlloc / budget) * 1000) / 10
        },
        {
          category: "lighting",
          items_count: 2,
          total_cost: lightingAlloc,
          percentage_of_budget: Math.round((lightingAlloc / budget) * 1000) / 10
        },
        {
          category: "ceiling_fans",
          items_count: 1,
          total_cost: fanAlloc,
          percentage_of_budget: Math.round((fanAlloc / budget) * 1000) / 10
        },
        {
          category: "misc",
          items_count: 2,
          total_cost: miscAlloc,
          percentage_of_budget: Math.round((miscAlloc / budget) * 1000) / 10
        }
      ],
      additional_suggestions: [
        "Time major furniture purchases during Amazon Great Indian Festival or Flipkart Big Billion Days to unlock up to 20% instant bank card discounts.",
        "Opt for warm 2700K lighting tones which visually expand compact urban flats without expensive architectural renovations.",
        `Keep the remaining reserve of ${formatINR(remaining)} for doorstep delivery surcharges and professional installation on heavy furniture units.`
      ]
    };
    return plan;
  }

  if (domain === "party") {
    // Categories: venue | catering | decoration | entertainment | contingency | gifts
    const guests = state.numGuests || 25;
    const cateringAlloc = Math.round(budget * 0.48);
    const decorationAlloc = Math.round(budget * 0.16);
    const entertainmentAlloc = Math.round(budget * 0.14);
    const venueAlloc = Math.round(budget * 0.12);
    const giftsAlloc = Math.round(budget * 0.06);
    const totalAlloc = cateringAlloc + decorationAlloc + entertainmentAlloc + venueAlloc + giftsAlloc;
    const remaining = Math.max(0, budget - totalAlloc);

    const perPlateEst = Math.round(cateringAlloc / guests);
    const cakeCost = Math.round(cateringAlloc * 0.22);
    const foodCost = cateringAlloc - cakeCost;

    const balloonDecorCost = Math.round(decorationAlloc * 0.65);
    const photoBoothCost = decorationAlloc - balloonDecorCost;

    const plan = {
      planner_type: "party",
      total_budget: budget,
      remaining_budget: remaining,
      party_details: {
        party_type: state.partyType || "Celebration Gathering",
        num_guests: guests,
        venue_type: state.venueType || "Rooftop Terrace / Private Room"
      },
      budget_breakdown: [
        {
          category: "catering",
          allocation: cateringAlloc,
          items: [
            {
              name: `Appetizer & Main Course Party Catering Package (${guests} Pax)`,
              description: `Curated hot buffet with 2 starters, 2 main courses, breads, aromatic rice, and dessert at approx ${formatINR(perPlateEst)} per guest.`,
              estimated_price: foodCost,
              quantity: 1,
              search_terms: "Party catering bulk orders Swiggy gourmet Zomato catering"
            },
            {
              name: "Artisan 2-Tier Celebration Cake (1.5 kg)",
              description: "Customized Belgian chocolate or red velvet frosted designer cake with commemorative topper.",
              estimated_price: cakeCost,
              quantity: 1,
              search_terms: "Custom designer birthday celebration cake delivery Zomato"
            }
          ]
        },
        {
          category: "decoration",
          allocation: decorationAlloc,
          items: [
            {
              name: "Chrome & Metallic Balloon Arch with Fairy Light Backdrop",
              description: "DIY high-sheen metallic balloon garland kit with warm LED curtain backdrop.",
              estimated_price: balloonDecorCost,
              quantity: 1,
              search_terms: "Metallic chrome balloon garland arch kit fairy lights Amazon India"
            },
            {
              name: "Custom Neon LED Sign & Selfie Photo Corner Stand",
              description: "Vibrant neon glow quote sign with floral garland border for guest photographs.",
              estimated_price: photoBoothCost,
              quantity: 1,
              search_terms: "Custom neon sign warm white photo backdrop Flipkart"
            }
          ]
        },
        {
          category: "entertainment",
          allocation: entertainmentAlloc,
          items: [
            {
              name: "High-Power Portable Party Speaker with Wireless Mic",
              description: "Bass-boosted Bluetooth party sound system with dynamic LED ring lights and karaoke microphone.",
              estimated_price: entertainmentAlloc,
              quantity: 1,
              search_terms: "JBL PartyBox Sony high power portable bluetooth party speaker Amazon India"
            }
          ]
        },
        {
          category: "venue",
          allocation: venueAlloc,
          items: [
            {
              name: "Clubhouse / Terrace Booking Fee or Clean-up Deposit",
              description: "Nominal reservation charge or private lounge amenity booking fee.",
              estimated_price: venueAlloc,
              quantity: 1,
              search_terms: "Clubhouse booking amenity fee or private terrace lounge OYO"
            }
          ]
        },
        {
          category: "gifts",
          allocation: giftsAlloc,
          items: [
            {
              name: `Personalized Return Gift Hampers (Pack of ${guests})`,
              description: "Scented soy candle and gourmet artisanal chocolate mini gift bags.",
              estimated_price: giftsAlloc,
              quantity: 1,
              search_terms: "Bulk return gift hampers scented candles artisanal chocolates Amazon India"
            }
          ]
        }
      ],
      venue_suggestions: [
        {
          name: "Residential Rooftop / Clubhouse Lounge",
          type: "Residential",
          capacity: Math.max(30, guests + 10),
          estimated_cost: venueAlloc,
          search_terms: "Residential society clubhouse terrace reservation NoBroker"
        },
        {
          name: "Private Cafe Garden Lawn / Rooftop Bistro",
          type: "Commercial",
          capacity: Math.max(40, guests + 15),
          estimated_cost: Math.round(budget * 0.25),
          search_terms: "Private party lounge rooftop cafe BookMyShow Zomato Dining"
        }
      ],
      calculation_table_inr: [
        {
          category: "catering",
          items_count: 2,
          total_cost: cateringAlloc,
          percentage_of_budget: Math.round((cateringAlloc / budget) * 1000) / 10
        },
        {
          category: "decoration",
          items_count: 2,
          total_cost: decorationAlloc,
          percentage_of_budget: Math.round((decorationAlloc / budget) * 1000) / 10
        },
        {
          category: "entertainment",
          items_count: 1,
          total_cost: entertainmentAlloc,
          percentage_of_budget: Math.round((entertainmentAlloc / budget) * 1000) / 10
        },
        {
          category: "venue",
          items_count: 1,
          total_cost: venueAlloc,
          percentage_of_budget: Math.round((venueAlloc / budget) * 1000) / 10
        },
        {
          category: "gifts",
          items_count: 1,
          total_cost: giftsAlloc,
          percentage_of_budget: Math.round((giftsAlloc / budget) * 1000) / 10
        }
      ],
      additional_suggestions: [
        `Booking catering directly via local caterers or Swiggy Minis can yield 15-20% discounts compared to a la carte restaurant orders for ${guests} guests.`,
        "Utilize smart playlists on Spotify or YouTube Music connected to high-output speakers to avoid professional DJ hiring fees.",
        `Maintain the ${formatINR(remaining)} contingency buffer for surprise guests, cold beverage ice refills, and delivery tips.`
      ]
    };
    return plan;
  }

  if (domain === "jewelry") {
    // Categories: necklace, earrings, bracelet, ring, watch
    const necklaceAlloc = Math.round(budget * 0.40);
    const earringsAlloc = Math.round(budget * 0.24);
    const braceletAlloc = Math.round(budget * 0.16);
    const ringAlloc = Math.round(budget * 0.12);
    const totalAlloc = necklaceAlloc + earringsAlloc + braceletAlloc + ringAlloc;
    const remaining = Math.max(0, budget - totalAlloc);

    const isGoldStyle = state.outfitStyle === "Ethnic" || state.outfitFormality === "Festive";

    const plan = {
      planner_type: "jewelry",
      total_budget: budget,
      remaining_budget: remaining,
      outfit_analysis: {
        colors: state.outfitColors || "Rich Jewel Tones & Gold Accents",
        style: state.outfitStyle || "Ethnic",
        formality: state.outfitFormality || "Festive"
      },
      jewelry_recommendations: [
        {
          item_type: "necklace",
          description: isGoldStyle 
            ? "Intricate 22K yellow gold plated temple choker necklace with antique matte sheen complementing traditional borders."
            : "Sterling silver 925 layered pendant necklace with prong-set sparkling cubic zirconia stones.",
          style: isGoldStyle ? "Heritage Temple Traditional" : "Modern Minimalist Chic",
          estimated_price: necklaceAlloc,
          search_terms: isGoldStyle ? "Antique gold temple choker necklace Tanishq CaratLane" : "Sterling silver 925 solitaire layered pendant BlueStone"
        },
        {
          item_type: "earrings",
          description: isGoldStyle
            ? "Classic gold-plated floral jhumkas with tiny pearl drops that balance the choker neckline."
            : "Sparkling silver baguette huggie drop earrings framing the face with subtle brilliance.",
          style: isGoldStyle ? "Traditional Jhumka" : "Contemporary Huggie Drops",
          estimated_price: earringsAlloc,
          search_terms: isGoldStyle ? "Gold floral jhumki earrings pearl cluster CaratLane Tanishq" : "Sterling silver drop earrings modern zircon BlueStone"
        },
        {
          item_type: "bracelet",
          description: isGoldStyle
            ? "Set of two handcrafted filigree openable brass kadas with rich micron gold plating."
            : "Dainty adjustable silver tennis bracelet with shimmering micro-pave stones.",
          style: isGoldStyle ? "Filigree Bangle" : "Tennis Bracelet",
          estimated_price: braceletAlloc,
          search_terms: isGoldStyle ? "Gold plated brass filigree openable kada pair Amazon India" : "925 sterling silver adjustable tennis bracelet Melorra"
        },
        {
          item_type: "ring",
          description: isGoldStyle
            ? "Statement circular cocktail ring with synthetic ruby center and kundan halo work."
            : "Geometric stackable band ring with rhodium finish for daily and party versatility.",
          style: isGoldStyle ? "Statement Kundan Ring" : "Minimalist Solitaire Band",
          estimated_price: ringAlloc,
          search_terms: isGoldStyle ? "Kundan cocktail statement ring gold finish CaratLane Meesho" : "Minimalist stackable solitaire silver band ring BlueStone"
        }
      ],
      styling_tips: [
        isGoldStyle 
          ? "When pairing a choker with high-neck blouses or heavy zari pallus, pin the dupatta neatly on one shoulder to showcase the neckpiece clearly."
          : "Avoid mixing warm yellow metals with cool silver accents; stick to a cohesive rhodium or rose-gold tone across earrings and bracelets.",
        "Apply perfumes and hairsprays at least 10 minutes prior to wearing fine or plated jewelry to protect luster and prevent oxidation.",
        `Your budget of ${formatINR(budget)} comfortably allows acquiring hallmarked 925 silver or high-grade micron-plated pieces with ${formatINR(remaining)} leftover for velvet jewelry organizer boxes.`
      ]
    };
    return plan;
  }
}

// --- DOM Rendering Engine ---
function renderUI() {
  const container = document.getElementById("plan-results");
  const plan = state.currentPlan;

  if (!plan) {
    container.innerHTML = `
      <div class="glass-panel rounded-2xl p-12 text-center border border-dashed border-slate-700">
        <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Ready to Plan Your Budget</h3>
        <p class="text-slate-400 max-w-md mx-auto mb-6">Select a preset above or enter your custom budget and preferences. PocketSmart AI will balance every rupee to perfection.</p>
        <button id="btn-quick-sample" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-lg shadow-emerald-900/40 inline-flex items-center gap-2">
          <span>Load Recommended Preset</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>
    `;

    document.getElementById("btn-quick-sample")?.addEventListener("click", () => {
      const presets = PRESETS[state.currentDomain];
      if (presets && presets[0]) applyPreset(presets[0]);
    });
    return;
  }

  // Calculate live totals
  let totalItemCost = 0;
  if (plan.planner_type === "jewelry") {
    totalItemCost = plan.jewelry_recommendations.reduce((sum, item) => sum + (item.estimated_price || 0), 0);
  } else {
    totalItemCost = plan.budget_breakdown.reduce((sum, cat) => {
      return sum + cat.items.reduce((s, i) => s + ((i.estimated_price || 0) * (i.quantity || 1)), 0);
    }, 0);
  }

  const remainingBudget = Math.max(0, plan.total_budget - totalItemCost);
  const percentUsed = Math.min(100, Math.round((totalItemCost / plan.total_budget) * 100));

  let html = `
    <!-- Top Summary Dashboard -->
    <div class="glass-panel rounded-2xl p-6 mb-8 border border-slate-700/60 shadow-xl">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              plan.planner_type === 'home' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              plan.planner_type === 'party' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }">
              ${plan.planner_type.toUpperCase()} EXECUTION PLAN
            </span>
            <span class="text-xs text-slate-400">Strict INR Balancing</span>
          </div>
          <h2 class="text-2xl font-bold font-display text-white">Smart Budget Overview</h2>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-copy-json" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 flex items-center gap-2 transition">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <span>Copy Pure JSON</span>
          </button>
          <button id="btn-print-plan" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 flex items-center gap-2 transition">
            <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            <span>Print / PDF</span>
          </button>
          <button id="btn-save-plan" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-emerald-900/30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            <span>Save Plan</span>
          </button>
        </div>
      </div>

      <!-- Financial Metric Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div class="glass-panel-light p-4 rounded-xl border border-slate-800">
          <p class="text-xs font-semibold uppercase text-slate-400 mb-1">Total Budget</p>
          <p class="text-2xl font-bold font-display text-white">${formatINR(plan.total_budget)}</p>
          <p class="text-xs text-slate-500 mt-1">Set limit in Indian Rupees</p>
        </div>
        <div class="glass-panel-light p-4 rounded-xl border border-slate-800">
          <p class="text-xs font-semibold uppercase text-slate-400 mb-1">Allocated Expenditure</p>
          <p class="text-2xl font-bold font-display text-emerald-400">${formatINR(totalItemCost)}</p>
          <div class="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" style="width: ${percentUsed}%"></div>
          </div>
          <p class="text-xs text-slate-400 mt-1">${percentUsed}% of total budget</p>
        </div>
        <div class="glass-panel-light p-4 rounded-xl border border-slate-800">
          <p class="text-xs font-semibold uppercase text-slate-400 mb-1">Remaining Safety Reserve</p>
          <p class="text-2xl font-bold font-display ${remainingBudget > 0 ? 'text-sky-400' : 'text-amber-400'}">${formatINR(remainingBudget)}</p>
          <p class="text-xs text-slate-500 mt-1">Buffer for taxes & delivery</p>
        </div>
      </div>

      ${plan.party_details ? `
        <!-- Party Spec Badge Bar -->
        <div class="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-800/80 text-sm">
          <div class="flex items-center gap-2 text-slate-300">
            <span class="text-slate-500">Event:</span>
            <span class="font-semibold text-white">${plan.party_details.party_type}</span>
          </div>
          <div class="flex items-center gap-2 text-slate-300">
            <span class="text-slate-500">Guests:</span>
            <span class="font-semibold text-white">${plan.party_details.num_guests} People</span>
          </div>
          <div class="flex items-center gap-2 text-slate-300">
            <span class="text-slate-500">Venue Setting:</span>
            <span class="font-semibold text-white">${plan.party_details.venue_type}</span>
          </div>
        </div>
      ` : ''}

      ${plan.outfit_analysis ? `
        <!-- Outfit Spec Badge Bar -->
        <div class="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-800/80 text-sm">
          <div class="flex items-center gap-2 text-slate-300">
            <span class="text-slate-500">Outfit Palette:</span>
            <span class="font-semibold text-emerald-300">${plan.outfit_analysis.colors}</span>
          </div>
          <div class="flex items-center gap-2 text-slate-300">
            <span class="text-slate-500">Aesthetic:</span>
            <span class="font-semibold text-white">${plan.outfit_analysis.style}</span>
          </div>
          <div class="flex items-center gap-2 text-slate-300">
            <span class="text-slate-500">Formality:</span>
            <span class="font-semibold text-white">${plan.outfit_analysis.formality}</span>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Itemized Breakdown Rendering
  if (plan.planner_type === "jewelry") {
    html += `
      <div class="mb-8">
        <h3 class="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
          <span>Jewelry & Accessory Recommendations</span>
          <span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">${plan.jewelry_recommendations.length} Items</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${plan.jewelry_recommendations.map((item, idx) => `
            <div class="glass-panel p-5 rounded-2xl border border-slate-700/60 hover:border-slate-600 transition flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    ${item.item_type}
                  </span>
                  <span class="text-lg font-bold font-display text-emerald-400">${formatINR(item.estimated_price)}</span>
                </div>
                <h4 class="font-semibold text-white mb-1.5">${item.style}</h4>
                <p class="text-sm text-slate-300 leading-relaxed mb-4">${item.description}</p>
              </div>

              <div class="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs text-slate-400 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <span>${item.search_terms}</span>
                </span>
                <div class="flex items-center gap-1.5">
                  <a href="${getPlatformSearchUrl('caratlane', item.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded text-xs font-semibold badge-caratlane hover:opacity-90 transition">CaratLane</a>
                  <a href="${getPlatformSearchUrl('tanishq', item.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded text-xs font-semibold badge-tanishq hover:opacity-90 transition">Tanishq</a>
                  <a href="${getPlatformSearchUrl('amazon', item.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded text-xs font-semibold badge-amazon hover:opacity-90 transition">Amazon</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    // Home or Party categories
    html += `
      <div class="mb-8">
        <h3 class="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
          <span>Categorized Item Breakdown</span>
          <span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">${plan.budget_breakdown.length} Categories</span>
        </h3>

        <div class="space-y-6">
          ${plan.budget_breakdown.map((categoryGroup, catIdx) => `
            <div class="glass-panel rounded-2xl p-5 border border-slate-700/60">
              <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div class="flex items-center gap-2.5">
                  <span class="w-3 h-3 rounded-full ${
                    catIdx % 4 === 0 ? 'bg-amber-400' :
                    catIdx % 4 === 1 ? 'bg-sky-400' :
                    catIdx % 4 === 2 ? 'bg-emerald-400' : 'bg-purple-400'
                  }"></span>
                  <h4 class="font-bold text-white capitalize text-lg">${categoryGroup.category.replace('_', ' ')}</h4>
                  <span class="text-xs text-slate-400">(${categoryGroup.items.length} items)</span>
                </div>
                <div class="text-right">
                  <span class="text-sm font-semibold text-emerald-400">${formatINR(categoryGroup.allocation)}</span>
                  <span class="text-xs text-slate-500 block">Category Allocation</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${categoryGroup.items.map((item, itemIdx) => `
                  <div class="glass-panel-light p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
                    <div>
                      <div class="flex items-start justify-between gap-2 mb-1.5">
                        <h5 class="font-semibold text-white text-base">${item.name}</h5>
                        <span class="text-emerald-400 font-bold font-display whitespace-nowrap">${formatINR(item.estimated_price)}</span>
                      </div>
                      <p class="text-xs text-slate-300 leading-relaxed mb-3">${item.description}</p>
                    </div>

                    <div class="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div class="flex items-center gap-2 text-xs text-slate-400">
                        <span>Qty: <strong class="text-white">${item.quantity || 1}</strong></span>
                        <span>•</span>
                        <span class="truncate max-w-[140px]" title="${item.search_terms}">${item.search_terms}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        ${plan.planner_type === 'party' ? `
                          <a href="${getPlatformSearchUrl('swiggy', item.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded text-xs font-semibold badge-swiggy hover:opacity-90 transition">Swiggy</a>
                          <a href="${getPlatformSearchUrl('zomato', item.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded text-xs font-semibold badge-zomato hover:opacity-90 transition">Zomato</a>
                          <a href="${getPlatformSearchUrl('amazon', item.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded text-xs font-semibold badge-amazon hover:opacity-90 transition">Amazon</a>
                        ` : `
                          <a href="${getPlatformSearchUrl('amazon', item.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded text-xs font-semibold badge-amazon hover:opacity-90 transition">Amazon</a>
                          <a href="${getPlatformSearchUrl('flipkart', item.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded text-xs font-semibold badge-flipkart hover:opacity-90 transition">Flipkart</a>
                          <a href="${getPlatformSearchUrl('ikea', item.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded text-xs font-semibold badge-ikea hover:opacity-90 transition">IKEA</a>
                        `}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Venue Suggestions (Party Route)
  if (plan.venue_suggestions && plan.venue_suggestions.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
          <span>Venue & Location Recommendations</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${plan.venue_suggestions.map(venue => `
            <div class="glass-panel p-5 rounded-2xl border border-slate-700/60">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  ${venue.type}
                </span>
                <span class="text-emerald-400 font-bold">${formatINR(venue.estimated_cost)}</span>
              </div>
              <h4 class="font-semibold text-white text-base mb-1">${venue.name}</h4>
              <p class="text-xs text-slate-400 mb-3">Capacity: <strong class="text-white">${venue.capacity} Guests</strong></p>
              <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span class="text-xs text-slate-400 truncate max-w-[200px]">${venue.search_terms}</span>
                <a href="${getPlatformSearchUrl('bookmyshow', venue.search_terms)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded text-xs font-semibold badge-bms hover:opacity-90 transition">BookMyShow / Venues</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Calculation Table
  const calcTable = plan.calculation_table || plan.calculation_table_inr;
  if (calcTable && calcTable.length > 0) {
    html += `
      <div class="glass-panel rounded-2xl p-6 mb-8 border border-slate-700/60">
        <h3 class="text-xl font-bold font-display text-white mb-4">Calculation Table (INR)</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-xs uppercase text-slate-400 border-b border-slate-800">
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4 text-center">Items Count</th>
                <th class="py-3 px-4 text-right">Total Cost</th>
                <th class="py-3 px-4 text-right">Budget Share</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80">
              ${calcTable.map(row => `
                <tr class="hover:bg-white/[0.02] transition">
                  <td class="py-3 px-4 font-semibold text-white capitalize">${row.category.replace('_', ' ')}</td>
                  <td class="py-3 px-4 text-center text-slate-300">${row.items_count}</td>
                  <td class="py-3 px-4 text-right font-display font-medium text-emerald-400">${formatINR(row.total_cost)}</td>
                  <td class="py-3 px-4 text-right">
                    <span class="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-800 text-slate-200">${row.percentage_of_budget}%</span>
                  </td>
                </tr>
              `).join('')}
              <tr class="font-bold text-white bg-slate-800/30">
                <td class="py-3 px-4">Allocated Subtotal</td>
                <td class="py-3 px-4 text-center text-slate-300">${calcTable.reduce((s, r) => s + r.items_count, 0)}</td>
                <td class="py-3 px-4 text-right text-emerald-400 font-display">${formatINR(calcTable.reduce((s, r) => s + r.total_cost, 0))}</td>
                <td class="py-3 px-4 text-right">${Math.round(calcTable.reduce((s, r) => s + r.percentage_of_budget, 0))}%</td>
              </tr>
              <tr class="text-slate-400">
                <td class="py-2.5 px-4 font-medium italic">Remaining Reserve</td>
                <td class="py-2.5 px-4 text-center">-</td>
                <td class="py-2.5 px-4 text-right font-display text-sky-400">${formatINR(remainingBudget)}</td>
                <td class="py-2.5 px-4 text-right text-xs">${Math.round((remainingBudget / plan.total_budget) * 100)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Suggestions & Tips
  const tips = plan.additional_suggestions || plan.styling_tips;
  if (tips && tips.length > 0) {
    html += `
      <div class="glass-panel rounded-2xl p-6 border border-slate-700/60 mb-8">
        <h3 class="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>${plan.planner_type === 'jewelry' ? 'Expert Styling Tips' : 'Practical Budget & Saving Tips'}</span>
        </h3>
        <ul class="space-y-3">
          ${tips.map(tip => `
            <li class="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
              <span class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
              <span>${tip}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  container.innerHTML = html;

  // Bind Export Buttons
  document.getElementById("btn-copy-json")?.addEventListener("click", () => {
    const rawJson = JSON.stringify(plan, null, 2);
    navigator.clipboard.writeText(rawJson).then(() => {
      alert("Pure JSON copied to clipboard successfully!");
    }).catch(err => {
      console.error(err);
      alert("Failed to copy. Please check browser permissions.");
    });
  });

  document.getElementById("btn-print-plan")?.addEventListener("click", () => {
    window.print();
  });

  document.getElementById("btn-save-plan")?.addEventListener("click", () => {
    saveCurrentPlan();
  });
}

// Save Plan to Local Storage
function saveCurrentPlan() {
  if (!state.currentPlan) return;
  const entry = {
    id: "plan_" + Date.now(),
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    domain: state.currentPlan.planner_type,
    budget: state.currentPlan.total_budget,
    plan: state.currentPlan
  };
  state.savedPlans.unshift(entry);
  if (state.savedPlans.length > 10) state.savedPlans.pop(); // keep last 10
  localStorage.setItem("pocketsmart_saved_plans", JSON.stringify(state.savedPlans));
  renderSavedPlansHistory();
  alert("Plan saved to your history!");
}

function renderSavedPlansHistory() {
  const container = document.getElementById("saved-plans-list");
  if (!container) return;

  if (state.savedPlans.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500 py-3 text-center">No saved plans yet. Generate and save one!</p>`;
    return;
  }

  container.innerHTML = state.savedPlans.map(item => `
    <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition flex items-center justify-between cursor-pointer" onclick="loadSavedPlan('${item.id}')">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase text-emerald-400">${item.domain}</span>
          <span class="text-xs text-slate-400">• ${item.date}</span>
        </div>
        <p class="text-sm font-semibold text-white font-display">${formatINR(item.budget)}</p>
      </div>
      <button class="p-1 text-slate-400 hover:text-white" title="Load this plan">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </button>
    </div>
  `).join('');
}

window.loadSavedPlan = function(id) {
  const found = state.savedPlans.find(p => p.id === id);
  if (found) {
    state.currentPlan = found.plan;
    state.currentDomain = found.domain;
    state.totalBudget = found.budget;
    syncDomainUI();
    renderUI();
    window.scrollTo({ top: document.getElementById("plan-results").offsetTop - 100, behavior: "smooth" });
  }
};

// Apply Preset
function applyPreset(preset) {
  state.totalBudget = preset.budget;
  state.userPrompt = preset.prompt;
  
  if (preset.partyType) state.partyType = preset.partyType;
  if (preset.guests) state.numGuests = preset.guests;
  if (preset.venueType) state.venueType = preset.venueType;

  if (preset.outfitColors) state.outfitColors = preset.outfitColors;
  if (preset.outfitStyle) state.outfitStyle = preset.outfitStyle;
  if (preset.formality) state.outfitFormality = preset.formality;

  // Sync inputs
  const budgetInput = document.getElementById("input-budget");
  const budgetSlider = document.getElementById("slider-budget");
  const promptInput = document.getElementById("input-prompt");

  if (budgetInput) budgetInput.value = preset.budget;
  if (budgetSlider) budgetSlider.value = preset.budget;
  if (promptInput) promptInput.value = preset.prompt;

  document.getElementById("budget-display").textContent = formatINR(preset.budget);

  // Generate plan immediately
  triggerPlanGeneration();
}

// Trigger Plan Generation
function triggerPlanGeneration() {
  const generateBtn = document.getElementById("btn-generate");
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      <span>Calculating Optimal Budget...</span>
    `;
  }

  setTimeout(() => {
    state.currentPlan = generateLocalPlan(state.currentDomain, state.totalBudget, state.userPrompt);
    renderUI();
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        <span>Generate Execution Plan</span>
      `;
    }
    // Scroll to results
    const resEl = document.getElementById("plan-results");
    if (resEl) {
      window.scrollTo({ top: resEl.offsetTop - 80, behavior: "smooth" });
    }
  }, 400);
}

// Sync UI for Selected Domain
function syncDomainUI() {
  // Update Domain Tabs
  document.querySelectorAll(".domain-tab").forEach(tab => {
    const domain = tab.getAttribute("data-domain");
    if (domain === state.currentDomain) {
      tab.classList.remove("text-slate-400", "bg-transparent");
      tab.classList.add("text-white", "bg-slate-800", "shadow-sm", "border-emerald-500/50");
    } else {
      tab.classList.remove("text-white", "bg-slate-800", "shadow-sm", "border-emerald-500/50");
      tab.classList.add("text-slate-400", "bg-transparent");
    }
  });

  // Render Presets for this domain
  const presetsContainer = document.getElementById("preset-chips-container");
  const presets = PRESETS[state.currentDomain] || [];
  presetsContainer.innerHTML = presets.map(p => `
    <button class="preset-chip text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition" data-preset-id="${p.id}">
      <span class="font-bold text-white block mb-0.5">${p.title}</span>
      <span class="text-emerald-400 font-semibold font-display">${formatINR(p.budget)}</span>
      <span class="text-slate-400 block mt-1 line-clamp-1">${p.description}</span>
    </button>
  `).join('');

  document.querySelectorAll(".preset-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = btn.getAttribute("data-preset-id");
      const p = presets.find(x => x.id === pId);
      if (p) applyPreset(p);
    });
  });

  // Show/Hide Domain specific fields
  const partyFields = document.getElementById("party-specific-fields");
  const jewelryFields = document.getElementById("jewelry-specific-fields");
  
  if (partyFields) {
    partyFields.classList.toggle("hidden", state.currentDomain !== "party");
  }
  if (jewelryFields) {
    jewelryFields.classList.toggle("hidden", state.currentDomain !== "jewelry");
  }
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  // Domain tab click handlers
  document.querySelectorAll(".domain-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      state.currentDomain = tab.getAttribute("data-domain");
      syncDomainUI();
    });
  });

  // Budget slider & number input synchronization
  const budgetInput = document.getElementById("input-budget");
  const budgetSlider = document.getElementById("slider-budget");
  const budgetDisplay = document.getElementById("budget-display");

  function updateBudget(val) {
    val = Math.max(1000, Math.min(1000000, Number(val) || 0));
    state.totalBudget = val;
    if (budgetInput) budgetInput.value = val;
    if (budgetSlider) budgetSlider.value = val;
    if (budgetDisplay) budgetDisplay.textContent = formatINR(val);
  }

  budgetSlider?.addEventListener("input", (e) => updateBudget(e.target.value));
  budgetInput?.addEventListener("input", (e) => updateBudget(e.target.value));

  // Quick budget chips
  document.querySelectorAll(".quick-budget-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const amount = btn.getAttribute("data-amount");
      if (amount) updateBudget(amount);
    });
  });

  // Prompt input
  const promptInput = document.getElementById("input-prompt");
  promptInput?.addEventListener("input", (e) => {
    state.userPrompt = e.target.value;
  });

  // Party inputs
  document.getElementById("input-party-type")?.addEventListener("change", (e) => {
    state.partyType = e.target.value;
  });
  document.getElementById("input-guests")?.addEventListener("input", (e) => {
    state.numGuests = Number(e.target.value) || 20;
    document.getElementById("guests-display").textContent = state.numGuests;
  });
  document.getElementById("input-venue-type")?.addEventListener("change", (e) => {
    state.venueType = e.target.value;
  });

  // Jewelry inputs & image preview
  document.getElementById("input-outfit-colors")?.addEventListener("input", (e) => {
    state.outfitColors = e.target.value;
  });
  document.getElementById("input-outfit-style")?.addEventListener("change", (e) => {
    state.outfitStyle = e.target.value;
  });
  document.getElementById("input-outfit-formality")?.addEventListener("change", (e) => {
    state.outfitFormality = e.target.value;
  });

  const imgUpload = document.getElementById("input-outfit-image");
  const imgPreviewContainer = document.getElementById("image-preview-container");
  const imgPreview = document.getElementById("image-preview");

  imgUpload?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        state.uploadedImage = event.target.result;
        if (imgPreview) imgPreview.src = event.target.result;
        if (imgPreviewContainer) imgPreviewContainer.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("btn-remove-image")?.addEventListener("click", () => {
    state.uploadedImage = null;
    if (imgUpload) imgUpload.value = "";
    if (imgPreviewContainer) imgPreviewContainer.classList.add("hidden");
  });

  // Generate button click
  document.getElementById("btn-generate")?.addEventListener("click", () => {
    triggerPlanGeneration();
  });

  // Initial Sync
  syncDomainUI();
  updateBudget(state.totalBudget);
  renderSavedPlansHistory();
  renderUI();
});
