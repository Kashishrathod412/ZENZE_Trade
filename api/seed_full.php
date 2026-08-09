<?php
require_once 'db.php';

// ---------------------------------------------------------------
// FULL SEED: Inserts all demo data from the React frontend into MySQL
// Run once by visiting: http://localhost/api/seed_full.php
// ---------------------------------------------------------------
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection unavailable. Please ensure MySQL is running."]);
    exit;
}

try {
    // Clear existing data (in correct order to avoid FK issues)
    $conn->query("DELETE FROM ads");
    $conn->query("DELETE FROM jobs");
    $conn->query("DELETE FROM inquiries");
    $conn->query("DELETE FROM deliveries");
    $conn->query("DELETE FROM products");
    $conn->query("DELETE FROM users");

    // ========== USERS ==========
    $userStmt = $conn->prepare("
        INSERT INTO users (id, name, email, password, role, sellerType, location, category, phone, website, createdAt, verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name)
    ");

    $users = [
        ["seller-1",        "Bharat Machines",      "bharat@demo.com",      "demo123",  "seller",   "manufacturer", "Ahmedabad",    "Industrial & Machinery",               "+91 98765 43210",  "https://bharatmachines.com",   "2024-01-15", 1],
        ["seller-2",        "Surat Textiles Co.",   "surat@demo.com",       "demo123",  "seller",   "manufacturer", "Surat",        "Textile & Fabric Industry",            "+91 97654 32100",  "https://surattextiles.co",     "2024-02-10", 1],
        ["seller-3",        "Green Agri Solutions", "green@demo.com",       "demo123",  "seller",   "supplier",     "Pune",         "Agriculture & Farming",                "+91 96543 21000",  NULL,                           "2024-03-05", 0],
        ["seller-4",        "Bright Electronics",   "bright@demo.com",      "demo123",  "seller",   "manufacturer", "Delhi",        "Electrical & Electronics",             "+91 95432 10000",  NULL,                           "2024-01-20", 1],
        ["seller-5",        "Tata Steel Traders",   "tata@demo.com",        "demo123",  "seller",   "trader",       "Mumbai",       "Construction & Building Materials",    "+91 94321 00000",  NULL,                           "2024-04-01", 1],
        ["seller-6",        "MedPharma Ltd",        "med@demo.com",         "demo123",  "seller",   "manufacturer", "Hyderabad",    "Beauty & Personal Care",               "+91 93210 00000",  NULL,                           "2024-02-15", 1],
        ["seller-7",        "PackRight India",      "pack@demo.com",        "demo123",  "seller",   "supplier",     "Chennai",      "Packaging & Logistics",                "+91 92100 00000",  NULL,                           "2024-05-10", 0],
        ["seller-8",        "SunPower Systems",     "sun@demo.com",         "demo123",  "seller",   "manufacturer", "Jaipur",       "Electrical & Electronics",             "+91 91000 00000",  NULL,                           "2024-03-20", 1],
        ["seller-9",        "IndoPress Mfg",        "indo@demo.com",        "demo123",  "seller",   "manufacturer", "Coimbatore",   "Industrial & Machinery",               "+91 90000 00001",  NULL,                           "2024-06-01", 1],
        ["seller-10",       "SpiceLand Exports",    "spice@demo.com",       "demo123",  "seller",   "trader",       "Ernakulam",    "Agriculture & Farming",                "+91 89000 00002",  NULL,                           "2024-04-15", 1],
        ["seller-11",       "PolyPlast India",      "poly@demo.com",        "demo123",  "seller",   "manufacturer", "Vadodara",     "Chemicals & Raw Materials",            "+91 88000 00003",  NULL,                           "2024-07-01", 0],
        ["seller-12",       "SafeGuard Equip",      "safe@demo.com",        "demo123",  "seller",   "supplier",     "Ludhiana",     "Construction & Building Materials",    "+91 87000 00004",  NULL,                           "2024-05-20", 1],
        ["seller-premium",  "Zenze Premium Hub",    "premium@zenze.tech",   "demo123",  "seller",   "manufacturer", "Global Hub",   "Industrial & Consumer Elite",          "+91 80000 00000",  "https://zenze.tech",           "2024-01-01", 1],
        ["buyer-1",         "Rahul Mehta",          "buyer@demo.com",       "demo123",  "buyer",    NULL,           NULL,           NULL,                                   NULL,               NULL,                           "2024-06-15", 0],
        ["admin-1",         "Zenze Admin",          "admin@zenze.tech",     "admin",    "admin",    NULL,           NULL,           NULL,                                   NULL,               NULL,                           "2024-01-01", 1],
    ];

    $userCount = 0;
    foreach ($users as $u) {
        $userStmt->execute($u);
        $userCount++;
    }

    // ========== PRODUCTS ==========
    $prodStmt = $conn->prepare("
        INSERT INTO products (id, name, category, priceNum, price, moq, description, image, sellerId, sellerName, sellerType, location, verified, views, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name)
    ");

    $products = [
        ["p-premium", "Elite Industrial Bridge Protocol",  "Industrial & Consumer Elite",          999999, "₹9,99,999",    "1 Node",       "The ultimate industrial bridge protocol for elite enterprises. Includes global verification and social node synchronization.",    "🛰️",  "seller-premium",   "Zenze Premium Hub",    "manufacturer", "Global Hub",   1, 9999,   "active",   "2024-01-01"],
        ["p1",        "Industrial CNC Machine",            "Industrial & Machinery",               450000, "₹4,50,000",    "1 Unit",       "High-precision Industrial CNC Machine designed for heavy-duty manufacturing operations.",                                        "🏭",  "seller-1",         "Bharat Machines",      "manufacturer", "Ahmedabad",    1, 1240,   "active",   "2024-06-01"],
        ["p2",        "Cotton Fabric Roll (50m)",          "Textile & Fabric Industry",            2500,   "₹2,500",       "100 Rolls",    "Premium quality cotton fabric roll, 50 meters length. Suitable for garment manufacturing and home textiles.",                   "🧵",  "seller-2",         "Surat Textiles Co.",   "manufacturer", "Surat",        1, 890,    "active",   "2024-06-05"],
        ["p3",        "Organic Fertilizer 50kg",           "Agriculture & Farming",                800,    "₹800",         "50 Bags",      "100% organic fertilizer for all crop types. Rich in nitrogen and phosphorus.",                                                  "🌿",  "seller-3",         "Green Agri Solutions", "supplier",     "Pune",         0, 650,    "active",   "2024-06-10"],
        ["p4",        "LED Panel Light 40W",               "Electrical & Electronics",             350,    "₹350",         "200 Units",    "Energy-efficient 40W LED panel light with 5-year warranty. Cool white 6500K.",                                                   "💡",  "seller-4",         "Bright Electronics",   "manufacturer", "Delhi",        1, 1100,   "active",   "2024-06-15"],
        ["p5",        "Stainless Steel Pipes",             "Construction & Building Materials",    1200,   "₹1,200/meter", "500 meters",   "Grade 304 stainless steel pipes for industrial and construction applications.",                                                  "🔧",  "seller-5",         "Tata Steel Traders",   "trader",       "Mumbai",       1, 980,    "active",   "2024-06-20"],
        ["p6",        "Pharmaceutical Capsules",           "Beauty & Personal Care",               5,      "₹5/unit",      "10,000 units", "Empty gelatin capsules size 0, suitable for pharmaceutical and nutraceutical use.",                                              "💊",  "seller-6",         "MedPharma Ltd",        "manufacturer", "Hyderabad",    1, 760,    "active",   "2024-06-25"],
        ["p7",        "Corrugated Boxes",                  "Packaging & Logistics",                15,     "₹15/piece",    "1000 pcs",     "3-ply corrugated boxes 12x10x8 inches. Ideal for e-commerce packaging.",                                                         "📦",  "seller-7",         "PackRight India",      "supplier",     "Chennai",      0, 540,    "active",   "2024-07-01"],
        ["p8",        "Solar Panel 400W Mono",             "Electrical & Electronics",             18000,  "₹18,000",      "10 Units",     "400W monocrystalline solar panel with 25-year performance warranty.",                                                            "☀️",  "seller-8",         "SunPower Systems",     "manufacturer", "Jaipur",       1, 1320,   "active",   "2024-07-05"],
        ["p9",        "Hydraulic Press 100T",              "Industrial & Machinery",               850000, "₹8,50,000",    "1 Unit",       "100-ton hydraulic press for metal forming, forging, and deep drawing.",                                                          "⚙️",  "seller-9",         "IndoPress Mfg",        "manufacturer", "Coimbatore",   1, 670,    "active",   "2024-07-10"],
        ["p10",       "Organic Turmeric Powder",           "Agriculture & Farming",                220,    "₹220/kg",      "500 kg",       "Premium organic turmeric powder with high curcumin content. Export quality.",                                                     "🌾",  "seller-10",        "SpiceLand Exports",    "trader",       "Ernakulam",    1, 890,    "active",   "2024-07-15"],
        ["p11",       "HDPE Granules",                     "Chemicals & Raw Materials",            95,     "₹95/kg",       "1000 kg",      "High-density polyethylene granules for blow molding and injection molding.",                                                      "🧪",  "seller-11",        "PolyPlast India",      "manufacturer", "Vadodara",     0, 430,    "active",   "2024-07-20"],
        ["p12",       "Safety Helmets (ISI)",              "Construction & Building Materials",    180,    "₹180/piece",   "500 pcs",      "ISI certified safety helmets with ratchet suspension. Meets IS 2925 standards.",                                                  "⛑️",  "seller-12",        "SafeGuard Equip",      "supplier",     "Ludhiana",     1, 560,    "active",   "2024-07-25"],
    ];

    $prodCount = 0;
    foreach ($products as $p) {
        $prodStmt->execute($p);
        $prodCount++;
    }

    // ========== JOBS ==========
    // First ensure jobs table has required columns
    $jobStmt = $conn->prepare("
        INSERT INTO jobs (id, title, department, location, type, salary, description, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title=VALUES(title)
    ");

    $jobs = [
        ["j1", "Senior Logistics Strategist",   "Operations",   "Dubai Hub / Remote",           "Full-time",    "₹18L - ₹24L",  "Design and implement high-efficiency extraction protocols for global trade routes.",   "open", date('Y-m-d H:i:s')],
        ["j2", "Lead UX Architect",             "Product",      "Global / Remote",              "Full-time",    "₹25L - ₹35L",  "Architecting the world's most sophisticated B2B industrial interfaces.",              "open", date('Y-m-d H:i:s')],
        ["j3", "Backend Systems Engineer",      "Engineering",  "Bangalore Node / Remote",      "Full-time",    "₹22L - ₹30L",  "Scale our real-time node synchronization and storage infrastructure.",               "open", date('Y-m-d H:i:s')],
        ["j4", "Growth Operations Manager",     "Marketing",    "Global / Remote",              "Full-time",    "₹15L - ₹20L",  "Scale the ZenzeTrade network presence across new industrial sectors.",               "open", date('Y-m-d H:i:s')],
    ];

    $jobCount = 0;
    foreach ($jobs as $j) {
        try {
            $jobStmt->execute($j);
            $jobCount++;
        } catch (Exception $e) {
            // Skip if column doesn't exist, we'll handle separately
        }
    }

    // ========== ADS ==========
    $adStmt = $conn->prepare("
        INSERT INTO ads (id, sellerId, type, productId, headline, message, status, verificationStatus, reach, clicks, duration, totalCost, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE headline=VALUES(headline)
    ");

    $ads = [
        ["ad-1", "seller-premium",  "daily",    NULL,   "Elite Enterprise Protocol",    "Connect with the world's most sophisticated B2B network.",     "active",   "approved", 12400,  890,    30, 49999,  date('Y-m-d H:i:s')],
        ["ad-2", "seller-1",        "package",  "p1",   "Industrial CNC Machine Sale",  "Get 15% off on high-precision CNC machines this month.",       "active",   "approved", 8500,   420,    15, 25000,  date('Y-m-d H:i:s')],
    ];

    $adCount = 0;
    foreach ($ads as $a) {
        try {
            $adStmt->execute($a);
            $adCount++;
        } catch (Exception $e) {
            // Skip if column doesn't exist
        }
    }

    echo json_encode([
        "success"  => true,
        "message"  => "✅ Database seeded successfully!",
        "inserted" => [
            "users"    => $userCount,
            "products" => $prodCount,
            "jobs"     => $jobCount,
            "ads"      => $adCount,
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "❌ Error: " . $e->getMessage()
    ]);
}
?>
