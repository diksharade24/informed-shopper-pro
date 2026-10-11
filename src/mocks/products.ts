/**
 * SAMPLE DATA — deterministic fixtures for UI development only.
 * Never imported by production (HTTP) services.
 */
import type { Campaign, Product } from "@/types/catalog";

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=70&auto=format&fit=crop`;

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1", slug: "cloudpod-wireless-headphones", name: "CloudPod Wireless Headphones", brand: "Sonora",
    category: "electronics", description: "Over-ear wireless headphones with soft memory-foam cushions and a built-in mic, tuned for long study and work sessions.",
    highlights: ["Up to 30h battery (manufacturer stated)", "Built-in microphone", "Foldable design"],
    specs: { Connectivity: "Bluetooth 5.3", Battery: "30 hours", Weight: "220 g", Microphone: "Yes" },
    images: [img("1505740420928-5e560c06d30e"), img("1583394838336-acd977736f90")],
    price: 1899, originalPrice: 2999, rating: 4.4, reviewCount: 1284, stock: 42, createdAt: "2026-08-02",
    variantGroup: "Color", variants: [
      { id: "p1-lilac", label: "Lilac", stock: 20 }, { id: "p1-black", label: "Black", stock: 22 },
      { id: "p1-cream", label: "Cream", stock: 0 },
    ],
    returnPolicy: "Sample policy text — final return terms come from the seller.", tags: ["headphones", "audio", "online classes", "wireless", "mic"],
  },
  {
    id: "p2", slug: "pulse-mini-speaker", name: "Pulse Mini Bluetooth Speaker", brand: "Sonora", category: "electronics",
    description: "Palm-sized speaker with a punchy sound and splash resistance.", highlights: ["IPX5 splash resistant", "12h playtime"],
    specs: { Connectivity: "Bluetooth 5.0", Battery: "12 hours", Weight: "310 g" }, images: [img("1608043152269-423dbba4e7e1")],
    price: 1499, originalPrice: 1999, rating: 4.2, reviewCount: 642, stock: 15, createdAt: "2026-07-10", tags: ["speaker", "audio", "party"],
  },
  {
    id: "p3", slug: "orbit-smartwatch", name: "Orbit Smartwatch", brand: "Nimbus", category: "electronics",
    description: "Lightweight smartwatch with step tracking, heart-rate sensor, and customizable faces.", highlights: ["AMOLED display", "Heart-rate sensor"],
    specs: { Display: "1.4\" AMOLED", Battery: "7 days", "Water resistance": "5 ATM" }, images: [img("1579586337278-3befd40fd17a"), img("1523275335684-37898b6baf30")],
    price: 3499, originalPrice: 4999, rating: 4.1, reviewCount: 389, stock: 4, createdAt: "2026-09-12",
    variantGroup: "Strap", variants: [{ id: "p3-mint", label: "Mint", stock: 2 }, { id: "p3-plum", label: "Plum", price: 3699, stock: 2 }],
    tags: ["watch", "fitness", "wearable"],
  },
  {
    id: "p4", slug: "snapshot-instant-camera", name: "Snapshot Instant Camera", brand: "Lumo", category: "electronics",
    description: "Point, shoot, and print tiny memories instantly.", highlights: ["Auto exposure", "Selfie mirror"],
    specs: { Film: "Mini instant film", Power: "2× AA" }, images: [img("1526170375885-4d8ecf77b99f")],
    price: 5999, rating: 4.6, reviewCount: 211, stock: 0, createdAt: "2026-06-01", tags: ["camera", "photo", "gift"],
  },
  {
    id: "p5", slug: "everyday-cotton-tee", name: "Everyday Cotton Tee", brand: "Threadly", category: "fashion",
    description: "Relaxed-fit tee in breathable 100% cotton.", highlights: ["100% cotton", "Relaxed fit"],
    specs: { Material: "Cotton", Fit: "Relaxed", Care: "Machine wash cold" }, images: [img("1521572163474-6864f9cf17ab")],
    price: 499, originalPrice: 799, rating: 4.3, reviewCount: 2310, stock: 120, createdAt: "2026-09-20",
    variantGroup: "Size", variants: [
      { id: "p5-s", label: "S", stock: 30 }, { id: "p5-m", label: "M", stock: 50 }, { id: "p5-l", label: "L", stock: 40 }, { id: "p5-xl", label: "XL", stock: 0 },
    ], tags: ["tshirt", "tee", "cotton", "college"],
  },
  {
    id: "p6", slug: "vintage-denim-jacket", name: "Vintage Wash Denim Jacket", brand: "Threadly", category: "fashion",
    description: "A classic denim jacket with a soft vintage wash.", highlights: ["Button front", "Two chest pockets"],
    specs: { Material: "Denim (cotton)", Fit: "Regular" }, images: [img("1551537482-f2075a1d41f2")],
    price: 2199, originalPrice: 2999, rating: 4.5, reviewCount: 540, stock: 18, createdAt: "2026-08-15",
    variantGroup: "Size", variants: [{ id: "p6-m", label: "M", stock: 10 }, { id: "p6-l", label: "L", stock: 8 }], tags: ["jacket", "denim"],
  },
  {
    id: "p7", slug: "street-runner-sneakers", name: "Street Runner Sneakers", brand: "Strider", category: "fashion",
    description: "Cushioned everyday sneakers that go with everything.", highlights: ["Cushioned sole", "Breathable mesh"],
    specs: { Upper: "Mesh", Sole: "EVA" }, images: [img("1542291026-7eec264c27ff")],
    price: 2799, originalPrice: 3999, rating: 4.4, reviewCount: 1802, stock: 33, createdAt: "2026-09-28",
    variantGroup: "Size (UK)", variants: [{ id: "p7-7", label: "7", stock: 10 }, { id: "p7-8", label: "8", stock: 12 }, { id: "p7-9", label: "9", stock: 11 }],
    tags: ["shoes", "sneakers", "running"],
  },
  {
    id: "p8", slug: "dewy-glow-serum", name: "Dewy Glow Vitamin C Serum", brand: "Bloomy", category: "beauty",
    description: "Lightweight serum with vitamin C for a fresh-looking glow.", highlights: ["30 ml", "Fragrance free"],
    specs: { Volume: "30 ml", "Skin type": "All" }, images: [img("1556228578-8c89e6adf883")],
    price: 649, originalPrice: 899, rating: 4.2, reviewCount: 976, stock: 60, createdAt: "2026-07-25", tags: ["serum", "skincare"],
  },
  {
    id: "p9", slug: "velvet-matte-lipstick", name: "Velvet Matte Lipstick", brand: "Bloomy", category: "beauty",
    description: "Comfortable matte lipstick with rich color payoff.", highlights: ["Long wear", "Matte finish"],
    specs: { Finish: "Matte", Weight: "4 g" }, images: [img("1586495777744-4413f21062fa")],
    price: 399, rating: 4.0, reviewCount: 455, stock: 80, createdAt: "2026-05-30",
    variantGroup: "Shade", variants: [{ id: "p9-coral", label: "Coral Crush", stock: 40 }, { id: "p9-berry", label: "Berry", stock: 40 }], tags: ["lipstick", "makeup"],
  },
  {
    id: "p10", slug: "amber-bloom-perfume", name: "Amber Bloom Eau de Parfum", brand: "Maison Lune", category: "beauty",
    description: "Warm floral fragrance with amber and jasmine notes.", highlights: ["50 ml", "Floral amber"],
    specs: { Volume: "50 ml", Notes: "Jasmine, amber, vanilla" }, images: [img("1541643600914-78b084683601")],
    price: 1899, originalPrice: 2499, rating: 4.5, reviewCount: 312, stock: 9, createdAt: "2026-09-05", tags: ["perfume", "fragrance", "gift"],
  },
  {
    id: "p11", slug: "speckle-ceramic-mug", name: "Speckle Ceramic Mug", brand: "Kiln & Co", category: "home-living",
    description: "Hand-glazed stoneware mug — every speckle is unique.", highlights: ["350 ml", "Microwave safe"],
    specs: { Capacity: "350 ml", Material: "Stoneware" }, images: [img("1514228742587-6b1558fcca3d")],
    price: 349, rating: 4.7, reviewCount: 820, stock: 200, createdAt: "2026-08-20", tags: ["mug", "kitchen", "gift"],
  },
  {
    id: "p12", slug: "arc-desk-lamp", name: "Arc LED Desk Lamp", brand: "Glowhaus", category: "home-living",
    description: "Adjustable LED desk lamp with three brightness levels.", highlights: ["3 brightness levels", "USB powered"],
    specs: { Power: "USB-C", "Color temperature": "3000–5000K" }, images: [img("1507473885765-e6ed057f782c")],
    price: 1299, originalPrice: 1599, rating: 4.3, reviewCount: 290, stock: 25, createdAt: "2026-09-30", tags: ["lamp", "study", "desk"],
  },
  {
    id: "p13", slug: "monstera-plant-pot", name: "Mini Monstera in Pot", brand: "Leafy", category: "home-living",
    description: "A small, easy-care monstera in a matte ceramic pot.", highlights: ["Indoor friendly", "Pot included"],
    specs: { Height: "~30 cm", Light: "Bright indirect" }, images: [img("1485955900006-10f4d324d411")],
    price: 799, rating: 4.4, reviewCount: 158, stock: 12, createdAt: "2026-07-01", tags: ["plant", "decor"],
  },
  {
    id: "p14", slug: "single-origin-coffee-beans", name: "Single Origin Coffee Beans", brand: "Hillbrew", category: "grocery",
    description: "Medium-roast whole beans from Chikmagalur.", highlights: ["250 g", "Medium roast"],
    specs: { Weight: "250 g", Roast: "Medium" }, images: [img("1559056199-641a0ac8b55e")],
    price: 450, rating: 4.6, reviewCount: 704, stock: 70, createdAt: "2026-09-18", tags: ["coffee", "beans"],
  },
  {
    id: "p15", slug: "wildflower-honey", name: "Raw Wildflower Honey", brand: "Hive & Hollow", category: "grocery",
    description: "Unprocessed wildflower honey in a glass jar.", highlights: ["500 g", "Glass jar"],
    specs: { Weight: "500 g" }, images: [img("1587049352846-4a222e784d38")],
    price: 399, originalPrice: 449, rating: 4.5, reviewCount: 389, stock: 0, createdAt: "2026-06-12", tags: ["honey", "breakfast"],
  },
  {
    id: "p16", slug: "flow-yoga-mat", name: "Flow Non-slip Yoga Mat", brand: "Strider", category: "sports-fitness",
    description: "6 mm cushioned mat with a grippy textured surface.", highlights: ["6 mm thick", "Carry strap"],
    specs: { Thickness: "6 mm", Material: "TPE" }, images: [img("1601925260368-ae2f83cf8b7f")],
    price: 999, originalPrice: 1499, rating: 4.3, reviewCount: 610, stock: 40, createdAt: "2026-08-08", tags: ["yoga", "mat", "workout"],
  },
  {
    id: "p17", slug: "hex-dumbbell-pair", name: "Hex Dumbbell Pair (5 kg)", brand: "IronLeaf", category: "sports-fitness",
    description: "Rubber-coated hex dumbbells that don't roll away.", highlights: ["2 × 5 kg", "Rubber coated"],
    specs: { Weight: "2 × 5 kg", Coating: "Rubber" }, images: [img("1517836357463-d25dfeac3438")],
    price: 1799, rating: 4.4, reviewCount: 233, stock: 6, createdAt: "2026-05-15", tags: ["dumbbell", "gym"],
  },
  {
    id: "p18", slug: "dotted-journal", name: "Dotted Bullet Journal A5", brand: "Papertale", category: "books-stationery",
    description: "160 pages of 100 gsm dotted paper with a lay-flat binding.", highlights: ["A5", "100 gsm paper"],
    specs: { Size: "A5", Pages: "160" }, images: [img("1531346878377-a5be20888e57")],
    price: 349, originalPrice: 449, rating: 4.7, reviewCount: 1120, stock: 90, createdAt: "2026-10-01", tags: ["journal", "notebook", "college"],
  },
  {
    id: "p19", slug: "cozy-reads-book-set", name: "Cozy Reads Fiction Set (3 books)", brand: "Papertale", category: "books-stationery",
    description: "A curated set of three feel-good paperbacks.", highlights: ["3 paperbacks", "English"],
    specs: { Format: "Paperback", Language: "English" }, images: [img("1544947950-fa07a98d237f")],
    price: 899, rating: 4.5, reviewCount: 98, stock: 22, createdAt: "2026-09-02", tags: ["books", "fiction", "gift"],
  },
  {
    id: "p20", slug: "campus-laptop-backpack", name: "Campus Laptop Backpack", brand: "Trailmate", category: "accessories",
    description: "Water-resistant backpack with a padded sleeve for laptops up to 15.6 inches.", highlights: ["Fits 15.6\" laptop", "Water resistant"],
    specs: { Capacity: "24 L", "Laptop sleeve": "Up to 15.6\"" }, images: [img("1553062407-98eeb64c6a62")],
    price: 1399, originalPrice: 1999, rating: 4.4, reviewCount: 1530, stock: 28, createdAt: "2026-09-25",
    variantGroup: "Color", variants: [{ id: "p20-grey", label: "Grey", stock: 14 }, { id: "p20-plum", label: "Plum", stock: 14 }],
    tags: ["backpack", "bag", "college", "laptop", "15 inch"],
  },
  {
    id: "p21", slug: "retro-round-sunglasses", name: "Retro Round Sunglasses", brand: "Lumo", category: "accessories",
    description: "UV400 round sunglasses with a lightweight frame.", highlights: ["UV400", "Lightweight"],
    specs: { Protection: "UV400", Frame: "Acetate" }, images: [img("1572635196237-14b3f281503f")],
    price: 799, originalPrice: 1199, rating: 4.1, reviewCount: 402, stock: 35, createdAt: "2026-07-18", tags: ["sunglasses", "summer"],
  },
  {
    id: "p22", slug: "canvas-tote-bag", name: "Everyday Canvas Tote", brand: "Trailmate", category: "accessories",
    description: "Sturdy canvas tote with an inner zip pocket.", highlights: ["Inner zip pocket", "Heavy canvas"],
    specs: { Material: "Cotton canvas" }, images: [img("1590874103328-eac38a683ce7")],
    price: 549, rating: 4.3, reviewCount: 276, stock: 50, createdAt: "2026-10-05", tags: ["tote", "bag"],
  },
  {
    id: "p23", slug: "ergo-lounge-chair", name: "Ergo Lounge Chair", brand: "Glowhaus", category: "home-living",
    description: "Mid-century inspired lounge chair with a padded seat.", highlights: ["Solid wood legs", "Padded seat"],
    specs: { Material: "Wood, fabric", "Max load": "110 kg" }, images: [img("1567538096630-e0c55bd6374c")],
    price: 8999, originalPrice: 11999, rating: 4.2, reviewCount: 64, stock: 3, createdAt: "2026-08-28", tags: ["chair", "furniture"],
  },
  {
    id: "p24", slug: "budget-wired-earphones", name: "Budget Wired Earphones with Mic", brand: "Nimbus", category: "electronics",
    description: "Simple wired earphones with an inline mic for calls and classes.", highlights: ["Inline mic", "3.5 mm jack"],
    specs: { Connectivity: "3.5 mm wired", Microphone: "Yes" }, images: [img("1590658268037-6bf12165a8df")],
    price: 349, originalPrice: 499, rating: 3.9, reviewCount: 3021, stock: 150, createdAt: "2026-04-10", tags: ["earphones", "audio", "online classes", "mic"],
  },
];

export const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: "c1", title: "Back-to-campus picks", description: "Backpacks, journals, and study lamps for the new term.",
    terms: "Sample campaign. Prices shown are the listed prices; no extra discount is applied.", tone: "butter", category: "books-stationery",
  },
  {
    id: "c2", title: "Glow-up week", description: "Skincare and makeup favourites in one place.",
    terms: "Sample campaign. Eligibility and offers will come from the promotions service.", tone: "mint", category: "beauty",
  },
];
