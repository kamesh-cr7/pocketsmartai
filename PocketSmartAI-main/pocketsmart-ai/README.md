# 🇮🇳 PocketSmart AI - Lifestyle & Event Budget Optimization

**PocketSmart AI** is a modern, responsive, and budget-conscious lifestyle and event planning web application tailored specifically for the Indian market (using INR / ₹).

It converts complex user financial constraints, guest counts, room requirements, and multimodal outfit styling preferences into precise, realistic, and balanced shopping & execution blueprints.

---

## 🌟 Core Features

### 1. 🏠 Home Interior Planner (`/generate-home`)
- Room setups, furniture, dimmable ambient smart lighting, BLDC ceiling fans, decor, and dining fixtures.
- 1-Click high-intent search shortcuts on **Amazon India, Flipkart, and IKEA India**.

### 2. 🎉 Party & Event Planner (`/generate-party`)
- Birthday parties, anniversary dinners, housewarmings (Griha Pravesh), rooftop cocktails, and engagement receptions.
- Scalable guest count calculator (5 to 150+ guests) with per-plate catering estimation.
- Venue suggestions and direct platform search for **Swiggy, Zomato, BookMyShow, and NoBroker**.

### 3. 💎 Jewelry & Styling Planner (`/generate-jewelry`)
- Visual outfit color harmony analysis, aesthetic matching (Ethnic, Minimalist, Modern, Festive, Workwear).
- Coordinated neckwear, jhumkas/earrings, bracelets, rings, and timepieces.
- Direct links for **CaratLane, Tanishq, BlueStone, Melorra, and Amazon India**.

### 4. 🧮 Strict INR Budget Balancing
- Sum of item estimated prices never exceeds the configured budget limit.
- Real-time remaining reserve tracking for transit delivery, taxes, and service tips.
- Itemized calculation table with count, total cost, and percentage share of budget.

### 5. ⚡ Zero-Friction Usability
- **Instant Recommended Presets**: Test with 1 click without typing.
- **Pure JSON Exporter**: 1-click clipboard copy of raw, valid schema-compliant JSON.
- **Print & PDF Export**: Instant formatted A4 report printout.
- **Saved History**: Persistent browser storage to bookmark previous budget blueprints.

---

## 🚀 Quick Start Guide

### Launch via Local Python Server
To start the web application and backend API:

```bash
cd /home/iron_man_2007/.gemini/antigravity/scratch/pocketsmart-ai
python3 server.py
```

Then open your browser and navigate to:
👉 **`http://localhost:8080/`**

### Direct Browser Access (Standalone)
You can also open `index.html` directly in Google Chrome, Firefox, or any modern web browser:
```bash
xdg-open /home/iron_man_2007/.gemini/antigravity/scratch/pocketsmart-ai/index.html
```

---

## 📡 REST API Endpoints

The server exposes three pure JSON endpoints matching the exact PocketSmart AI schema specifications:

1. **`POST /generate-home`**
   - Payload: `{"total_budget": 50000, "requirements": "Living room setup"}`
2. **`POST /generate-party`**
   - Payload: `{"total_budget": 30000, "num_guests": 25, "party_type": "Birthday Party"}`
3. **`POST /generate-jewelry`**
   - Payload: `{"total_budget": 25000, "colors": "Emerald Green", "style": "Ethnic"}`

---

## 🎨 Recommended Workspace
Set `/home/iron_man_2007/.gemini/antigravity/scratch/pocketsmart-ai` as your active workspace in Antigravity to explore and customize the code.
