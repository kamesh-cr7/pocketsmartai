#!/usr/bin/env python3
"""
PocketSmart AI - Lightweight Local Web & API Server
Serves static frontend assets and exposes pure JSON planning endpoints:
  - POST /generate-home
  - POST /generate-party
  - POST /generate-jewelry
"""

import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer
import socket

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def calculate_home_plan(budget: float, prompt: str = ""):
    budget = float(budget or 50000.0)
    furniture_alloc = round(budget * 0.52, 2)
    lighting_alloc = round(budget * 0.15, 2)
    fan_alloc = round(budget * 0.13, 2)
    misc_alloc = round(budget * 0.13, 2)
    
    sofa_cost = round(furniture_alloc * 0.58, 2)
    table_cost = round(furniture_alloc * 0.18, 2)
    shelf_cost = round(furniture_alloc - sofa_cost - table_cost, 2)
    
    main_light = round(lighting_alloc * 0.55, 2)
    lamp = round(lighting_alloc - main_light, 2)
    
    fan_cost = fan_alloc
    
    rug_cost = round(misc_alloc * 0.60, 2)
    curtains_cost = round(misc_alloc - rug_cost, 2)
    
    items = [
        {"cat": "furniture", "name": "Wakefit 3 Seater Fabric Sofa", "desc": "Comfortable high-density foam 3-seater sofa in dark grey fabric.", "price": sofa_cost, "qty": 1, "terms": "Wakefit 3 seater fabric sofa modern grey Amazon India"},
        {"cat": "furniture", "name": "IKEA LACK Coffee Table", "desc": "Minimalist black-brown wooden finish lightweight coffee table.", "price": table_cost, "qty": 1, "terms": "IKEA LACK coffee table black brown IKEA India"},
        {"cat": "furniture", "name": "DeckUp Plank Engineered Wood Bookcase", "desc": "Open tier shelving unit in wenge finish for books, plants, and decor.", "price": shelf_cost, "qty": 1, "terms": "DeckUp Plank 4 tier engineered wood display rack Flipkart"},
        {"cat": "lighting", "name": "Philips Wiz Smart LED Downlight Set of 4", "desc": "Dimmable smart Wi-Fi recessed downlights for ambient living room lighting.", "price": main_light, "qty": 1, "terms": "Philips Wiz 10W smart recessed downlight pack of 4 Amazon India"},
        {"cat": "lighting", "name": "Crosscut Wooden Tripod Floor Lamp", "desc": "Nordic style standing corner floor lamp with jute shade.", "price": lamp, "qty": 1, "terms": "Crosscut tripod wooden floor lamp with shade Amazon India"},
        {"cat": "ceiling_fans", "name": "Atomberg Renesa 1200mm BLDC Ceiling Fan", "desc": "Energy-efficient 28W brushless DC motor fan with remote control.", "price": fan_cost, "qty": 1, "terms": "Atomberg Renesa 1200mm BLDC ceiling fan matte black Amazon India"},
        {"cat": "misc", "name": "Status Contract Polypropylene Area Rug 4x6 Ft", "desc": "Anti-skid soft short-pile living room carpet in neutral cream and grey.", "price": rug_cost, "qty": 1, "terms": "Status Contract 4x6 feet geometric carpet area rug Amazon India"},
        {"cat": "misc", "name": "Urban Space Blackout Eyelet Curtains Pair 7 Ft", "desc": "Thermal insulated solid weave door and window drape set.", "price": curtains_cost, "qty": 1, "terms": "Urban Space 7 feet blackout curtains pair grey Amazon India"}
    ]
    
    total_spent = sum(item["price"] for item in items)
    remaining = round(budget - total_spent, 2)
    
    categories = ["furniture", "lighting", "ceiling_fans", "misc"]
    breakdown = []
    calc_table = []
    
    for cat in categories:
        cat_items = [i for i in items if i["cat"] == cat]
        cat_cost = round(sum(i["price"] for i in cat_items), 2)
        breakdown.append({
            "category": cat,
            "allocation": cat_cost,
            "items": [
                {
                    "name": i["name"],
                    "description": i["desc"],
                    "estimated_price": i["price"],
                    "quantity": i["qty"],
                    "search_terms": i["terms"]
                } for i in cat_items
            ]
        })
        calc_table.append({
            "category": cat,
            "items_count": len(cat_items),
            "total_cost": cat_cost,
            "percentage_of_budget": round((cat_cost / budget) * 100, 1)
        })
        
    return {
        "planner_type": "home",
        "total_budget": budget,
        "remaining_budget": remaining,
        "budget_breakdown": breakdown,
        "calculation_table": calc_table,
        "additional_suggestions": [
            "Consider timing furniture purchases during Amazon Great Indian Festival or Flipkart Big Billion Days to secure up to 20% instant card discounts.",
            "Warm 2700K lighting visually expands compact living rooms without expensive architectural alterations.",
            f"Reserve the remaining balance of INR {remaining} for doorstep delivery fees and professional furniture assembly."
        ]
    }

def calculate_party_plan(budget: float, party_type: str = "Birthday Party", guests: int = 25, venue: str = "Rooftop Terrace"):
    budget = float(budget or 30000.0)
    guests = int(guests or 25)
    catering_alloc = round(budget * 0.48, 2)
    decor_alloc = round(budget * 0.16, 2)
    ent_alloc = round(budget * 0.14, 2)
    venue_alloc = round(budget * 0.12, 2)
    gifts_alloc = round(budget * 0.06, 2)
    
    food_cost = round(catering_alloc * 0.78, 2)
    cake_cost = round(catering_alloc - food_cost, 2)
    
    balloon_cost = round(decor_alloc * 0.65, 2)
    sign_cost = round(decor_alloc - balloon_cost, 2)
    
    items = [
        {"cat": "catering", "name": f"Curated Party Buffet Catering ({guests} Guests)", "desc": "2 Starters, 2 Mains, assorted breads, fragrant rice, and gulab jamun.", "price": food_cost, "qty": 1, "terms": "Party catering bulk orders Swiggy gourmet Zomato catering"},
        {"cat": "catering", "name": "Artisan Designer Celebration Cake 1.5kg", "desc": "Customized Belgian chocolate truffle or red velvet frosted designer cake.", "price": cake_cost, "qty": 1, "terms": "Custom designer birthday celebration cake delivery Zomato"},
        {"cat": "decoration", "name": "Metallic Chrome Balloon Arch & Fairy Curtain", "desc": "DIY high-sheen metallic balloon garland kit with warm LED curtain backdrop.", "price": balloon_cost, "qty": 1, "terms": "Metallic chrome balloon garland arch kit fairy lights Amazon India"},
        {"cat": "decoration", "name": "Custom Warm Neon Sign & Selfie Stand", "desc": "Vibrant glowing quote sign with floral garland border for photography.", "price": sign_cost, "qty": 1, "terms": "Custom neon sign warm white photo backdrop Flipkart"},
        {"cat": "entertainment", "name": "High-Power Bluetooth Party Speaker with Mic", "desc": "Bass-boosted portable sound system with dynamic light show and mic.", "price": ent_alloc, "qty": 1, "terms": "JBL PartyBox high power portable bluetooth party speaker Amazon India"},
        {"cat": "venue", "name": "Terrace / Clubhouse Booking Deposit", "desc": "Society amenity booking fee or private rooftop terrace hire deposit.", "price": venue_alloc, "qty": 1, "terms": "Residential society clubhouse terrace reservation NoBroker"},
        {"cat": "gifts", "name": f"Return Gift Hampers (Pack of {guests})", "desc": "Scented soy candle and gourmet artisanal chocolate mini gift bags.", "price": gifts_alloc, "qty": 1, "terms": "Bulk return gift hampers scented candles artisanal chocolates Amazon India"}
    ]
    
    total_spent = sum(item["price"] for item in items)
    remaining = round(budget - total_spent, 2)
    
    categories = ["catering", "decoration", "entertainment", "venue", "gifts"]
    breakdown = []
    calc_table = []
    
    for cat in categories:
        cat_items = [i for i in items if i["cat"] == cat]
        cat_cost = round(sum(i["price"] for i in cat_items), 2)
        breakdown.append({
            "category": cat,
            "allocation": cat_cost,
            "items": [
                {
                    "name": i["name"],
                    "description": i["desc"],
                    "estimated_price": i["price"],
                    "quantity": i["qty"],
                    "search_terms": i["terms"]
                } for i in cat_items
            ]
        })
        calc_table.append({
            "category": cat,
            "items_count": len(cat_items),
            "total_cost": cat_cost,
            "percentage_of_budget": round((cat_cost / budget) * 100, 1)
        })
        
    return {
        "planner_type": "party",
        "total_budget": budget,
        "remaining_budget": remaining,
        "party_details": {
            "party_type": party_type,
            "num_guests": guests,
            "venue_type": venue
        },
        "budget_breakdown": breakdown,
        "venue_suggestions": [
            {
                "name": "Society Rooftop / Clubhouse Terrace",
                "type": "Residential",
                "capacity": guests + 10,
                "estimated_cost": venue_alloc,
                "search_terms": "Residential society clubhouse terrace reservation NoBroker"
            },
            {
                "name": "Boutique Rooftop Cafe Lawn",
                "type": "Commercial",
                "capacity": guests + 20,
                "estimated_cost": round(budget * 0.25, 2),
                "search_terms": "Private party lounge rooftop cafe BookMyShow Zomato Dining"
            }
        ],
        "calculation_table_inr": calc_table,
        "additional_suggestions": [
            f"Ordering catering directly from local kitchen caterers via Swiggy Minis can save up to 20% on bulk food bills for {guests} guests.",
            "Connect a smartphone with curated Spotify playlists to eliminate standalone DJ hiring charges.",
            f"Keep the INR {remaining} balance as a contingency buffer for extra ice refills, disposable cutlery, and delivery tips."
        ]
    }

def calculate_jewelry_plan(budget: float, colors: str = "Emerald Green & Antique Gold", style: str = "Ethnic", formality: str = "Festive"):
    budget = float(budget or 25000.0)
    necklace_cost = round(budget * 0.40, 2)
    earrings_cost = round(budget * 0.24, 2)
    bracelet_cost = round(budget * 0.16, 2)
    ring_cost = round(budget * 0.12, 2)
    
    total_spent = necklace_cost + earrings_cost + bracelet_cost + ring_cost
    remaining = round(budget - total_spent, 2)
    
    is_gold = style.lower() == "ethnic" or formality.lower() == "festive"
    
    return {
        "planner_type": "jewelry",
        "total_budget": budget,
        "remaining_budget": remaining,
        "outfit_analysis": {
            "colors": colors,
            "style": style,
            "formality": formality
        },
        "jewelry_recommendations": [
            {
                "item_type": "necklace",
                "description": "Intricate 22K yellow gold plated temple choker necklace with antique matte sheen complementing traditional borders." if is_gold else "Sterling silver 925 layered pendant necklace with prong-set sparkling cubic zirconia stones.",
                "style": "Heritage Temple Traditional" if is_gold else "Modern Minimalist Chic",
                "estimated_price": necklace_cost,
                "search_terms": "Antique gold temple choker necklace Tanishq CaratLane" if is_gold else "Sterling silver 925 solitaire layered pendant BlueStone"
            },
            {
                "item_type": "earrings",
                "description": "Classic gold-plated floral jhumkas with tiny pearl drops that balance the choker neckline." if is_gold else "Sparkling silver baguette huggie drop earrings framing the face with subtle brilliance.",
                "style": "Traditional Jhumka" if is_gold else "Contemporary Huggie Drops",
                "estimated_price": earrings_cost,
                "search_terms": "Gold floral jhumki earrings pearl cluster CaratLane Tanishq" if is_gold else "Sterling silver drop earrings modern zircon BlueStone"
            },
            {
                "item_type": "bracelet",
                "description": "Set of two handcrafted filigree openable brass kadas with rich micron gold plating." if is_gold else "Dainty adjustable silver tennis bracelet with shimmering micro-pave stones.",
                "style": "Filigree Bangle" if is_gold else "Tennis Bracelet",
                "estimated_price": bracelet_cost,
                "search_terms": "Gold plated brass filigree openable kada pair Amazon India" if is_gold else "925 sterling silver adjustable tennis bracelet Melorra"
            },
            {
                "item_type": "ring",
                "description": "Statement circular cocktail ring with synthetic ruby center and kundan halo work." if is_gold else "Geometric stackable band ring with rhodium finish for daily and party versatility.",
                "style": "Statement Kundan Ring" if is_gold else "Minimalist Solitaire Band",
                "estimated_price": ring_cost,
                "search_terms": "Kundan cocktail statement ring gold finish CaratLane Meesho" if is_gold else "Minimalist stackable solitaire silver band ring BlueStone"
            }
        ],
        "styling_tips": [
            "Pin the dupatta or pallu neatly on one shoulder when wearing a choker to showcase the neckline prominently.",
            "Avoid mixing yellow gold and silver metals; maintain consistent metal undertones across all pieces.",
            f"Your budget of INR {budget} comfortably enables acquiring hallmarked 925 silver or micron-plated heirlooms with INR {remaining} reserved for velvet jewelry organizers."
        ]
    }

class PocketSmartHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            payload = json.loads(post_data)
        except Exception:
            payload = {}

        path = self.path.split("?")[0]
        
        response_data = None
        if path == "/generate-home":
            budget = payload.get("total_budget", 50000.0)
            prompt = payload.get("requirements", "")
            response_data = calculate_home_plan(budget, prompt)
        elif path == "/generate-party":
            budget = payload.get("total_budget", 30000.0)
            party_type = payload.get("party_type", "Birthday Party")
            guests = payload.get("num_guests", 25)
            venue = payload.get("venue_type", "Rooftop Terrace")
            response_data = calculate_party_plan(budget, party_type, guests, venue)
        elif path == "/generate-jewelry":
            budget = payload.get("total_budget", 25000.0)
            colors = payload.get("colors", "Emerald Green & Antique Gold")
            style = payload.get("style", "Ethnic")
            formality = payload.get("formality", "Festive")
            response_data = calculate_jewelry_plan(budget, colors, style, formality)

        if response_data is not None:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(response_data, indent=2).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    port = PORT
    server_address = ("", port)
    try:
        httpd = HTTPServer(server_address, PocketSmartHandler)
    except OSError:
        port = 8081
        server_address = ("", port)
        httpd = HTTPServer(server_address, PocketSmartHandler)
        
    print(f"PocketSmart AI Server running at http://localhost:{port}/")
    print(f"Directory: {DIRECTORY}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
