const { db, admin } = require('./config/firebase');

const seedData = async () => {
    try {
        console.log('--- LendeX Premium Seed v2.0 ---');
        console.log('Clearing existing product data...');
        const snapshot = await db.collection('products').get();
        const deleteBatch = db.batch();
        snapshot.docs.forEach((doc) => deleteBatch.delete(doc.ref));
        await deleteBatch.commit();
        console.log(`Deleted ${snapshot.size} old products.`);

        // Ensure merchant exists
        const usersSnap = await db.collection('users').where('email', '==', 'admin@lendex.com').get();
        let merchantId;
        if (usersSnap.empty) {
            merchantId = 'mock_uid_admin_123';
            await db.collection('users').doc(merchantId).set({
                firebaseUid: merchantId,
                name: 'LendeX Authorized Merchant',
                email: 'admin@lendex.com',
                role: 'merchant',
                verified: true,
                createdAt: new Date().toISOString()
            });
            console.log('Created merchant record.');
        } else {
            merchantId = usersSnap.docs[0].id;
        }

        const products = [
            // ─── ELECTRONICS ─────────────────────────────────────────
            {
                title: 'RED Komodo 6K Cinema Camera',
                category: 'Electronics',
                pricePerDay: 15000,
                securityDeposit: 100000,
                condition: 'Excellent',
                rating: 4.9, reviewCount: 41,
                images: ['https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=800&q=80'],
                description: 'The RED Komodo 6K is a compact cinema powerhouse. Global shutter eliminates rolling shutter distortion. Ideal for professional film productions and high-end commercials.',
                specs: { sensor: '6K Global Shutter CMOS', mount: 'Canon RF', fps: 'Up to 40fps @ 6K', weight: '1.2kg' }
            },
            {
                title: 'Sony FX6 Full-Frame Cinema Camera',
                category: 'Electronics',
                pricePerDay: 9000,
                securityDeposit: 75000,
                condition: 'Excellent',
                rating: 4.8, reviewCount: 37,
                images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80'],
                description: 'Full-frame 10.2MP cinema camera with 15+ stops of dynamic range. Perfect for documentary and event filmmaking with its compact form factor.',
                specs: { sensor: '12.1MP Full-Frame BSI', mount: 'Sony E-Mount', fps: '4K 120fps', iso: 'Up to ISO 409600' }
            },
            {
                title: 'DJI Mavic 3 Pro Drone',
                category: 'Electronics',
                pricePerDay: 4500,
                securityDeposit: 30000,
                condition: 'New',
                rating: 4.9, reviewCount: 68,
                images: ['https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?w=800&q=80'],
                description: 'Triple-camera flagship drone with Hasselblad main camera. Omnidirectional obstacle sensing, 43-min flight time, and 15km video transmission.',
                specs: { camera: 'Hasselblad 4/3 CMOS', range: '15km', flightTime: '43 min', resolution: '5.1K 50fps' }
            },
            {
                title: 'MacBook Pro 16" M3 Max',
                category: 'Electronics',
                pricePerDay: 6500,
                securityDeposit: 60000,
                condition: 'New',
                rating: 4.9, reviewCount: 55,
                images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
                description: '128GB Unified RAM, 40-core GPU chip. Render 8K ProRes timelines in real-time. The industry-leading laptop for video editors, 3D artists, and developers.',
                specs: { chip: 'Apple M3 Max', ram: '128GB Unified', storage: '4TB SSD', display: '16.2" Liquid Retina XDR' }
            },
            {
                title: 'Sony Alpha a7R V Mirrorless',
                category: 'Electronics',
                pricePerDay: 4000,
                securityDeposit: 40000,
                condition: 'Excellent',
                rating: 4.8, reviewCount: 29,
                images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80'],
                description: '61MP full-frame BSI sensor with AI-powered autofocus. Ideal for professional portrait, landscape, and fashion photography.',
                specs: { resolution: '61MP', stabilization: '8-stop IBIS', video: '4K 60fps', battery: '800 shots/charge' }
            },
            {
                title: 'Meta Quest 3 512GB Headset',
                category: 'Electronics',
                pricePerDay: 1800,
                securityDeposit: 12000,
                condition: 'New',
                rating: 4.7, reviewCount: 44,
                images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80'],
                description: 'Next-generation standalone mixed reality headset. 4K+ Infinite Display, Snapdragon XR2 Gen 2, and the largest VR game library available.',
                specs: { display: '4128x2208 per eye', processor: 'Snapdragon XR2 Gen 2', storage: '512GB', battery: '3+ hours' }
            },
            {
                title: 'Canon EOS R5 C Cinema Camera',
                category: 'Electronics',
                pricePerDay: 7500,
                securityDeposit: 55000,
                condition: 'Excellent',
                rating: 4.8, reviewCount: 32,
                images: ['https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80'],
                description: 'Hybrid powerhouse combining 8K cinema recording with 45MP stills. Unlimited 8K RAW internal recording with active cooling system.',
                specs: { resolution: '8K RAW Internal', sensor: '45MP Full-Frame CMOS', fps: '8K 30fps / 4K 120fps', cooling: 'Active Fan' }
            },
            {
                title: 'Apple iPad Pro 13" M4',
                category: 'Electronics',
                pricePerDay: 2500,
                securityDeposit: 20000,
                condition: 'New',
                rating: 4.8, reviewCount: 38,
                images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
                description: 'Thinnest Apple product ever. Ultra Retina XDR OLED display, M4 chip, and Apple Pencil Pro support. Perfect for digital artists and presentations.',
                specs: { chip: 'Apple M4', display: '13" Ultra Retina XDR OLED', storage: '1TB', pencil: 'Apple Pencil Pro' }
            },

            // ─── TOOLS ───────────────────────────────────────────────
            {
                title: 'Festool Kapex KS 120 Miter Saw',
                category: 'Tools',
                pricePerDay: 3000,
                securityDeposit: 25000,
                condition: 'Excellent',
                rating: 4.9, reviewCount: 19,
                images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80'],
                description: 'The industry-leading sliding compound miter saw with dual laser guide, proprietary dust extraction, and carbon-brushless motor for superior precision.',
                specs: { power: '1600W', capacity: '305mm blade', bevel: '-2° to 47°', weight: '14.6kg' }
            },
            {
                title: 'DeWalt 20V MAX 7-Tool Combo Kit',
                category: 'Tools',
                pricePerDay: 1500,
                securityDeposit: 12000,
                condition: 'Good',
                rating: 4.7, reviewCount: 62,
                images: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80'],
                description: 'Complete cordless system: drill/driver, impact driver, reciprocal saw, circular saw, grinder, multi-tool, and LED worklight. Includes 3 batteries.',
                specs: { voltage: '20V MAX', batteries: '3x 2Ah', tools: '7 piece', charger: '1-hour rapid' }
            },
            {
                title: 'Bosch SDS-Max Rotary Hammer',
                category: 'Tools',
                pricePerDay: 1200,
                securityDeposit: 8000,
                condition: 'Good',
                rating: 4.6, reviewCount: 28,
                images: ['https://images.unsplash.com/photo-1581783898377-1c85bf938427?w=800&q=80'],
                description: 'Industrial-grade rotary hammer with 14.5 joules of impact energy. Perfect for heavy concrete drilling and demolition on commercial job sites.',
                specs: { power: '1500W', impact: '14.5J', modes: '3 (rotary, hammer, chiseling)', weight: '9.8kg' }
            },
            {
                title: 'Milwaukee M18 FUEL Cordless Nailer',
                category: 'Tools',
                pricePerDay: 800,
                securityDeposit: 6000,
                condition: 'Excellent',
                rating: 4.8, reviewCount: 23,
                images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'],
                description: 'First cordless framing nailer with no compressor or hose. Drives up to 21 nails/sec with same power as pneumatic nailers.',
                specs: { nails: '21 nails/sec', gauge: '30-34 degree', battery: 'M18 18V', weight: '3.4kg' }
            },
            {
                title: 'Husqvarna 572 XP Professional Chainsaw',
                category: 'Tools',
                pricePerDay: 2000,
                securityDeposit: 10000,
                condition: 'Good',
                rating: 4.7, reviewCount: 15,
                images: ['https://images.unsplash.com/photo-1590234934177-331206fbb329?w=800&q=80'],
                description: 'Professional-grade 73.5cc X-TORQ chainsaw with X-CUT chain. Designed for demanding logging operations and professional arborists.',
                specs: { engine: '73.5cc X-TORQ', bar: '18-24 inch', power: '4.7kW', weight: '6.4kg' }
            },
            {
                title: 'FLIR E8-XT Thermal Camera',
                category: 'Tools',
                pricePerDay: 3500,
                securityDeposit: 28000,
                condition: 'Excellent',
                rating: 4.9, reviewCount: 11,
                images: ['https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?w=800&q=80'],
                description: 'Professional thermal imaging camera with 320x240 IR resolution. Essential for electrical inspections, HVAC diagnostics, and building envelope surveys.',
                specs: { resolution: '320x240 IR', accuracy: '±2°C', temperature: '-20 to 550°C', display: '3.5" LCD touchscreen' }
            },

            // ─── OUTDOORS ─────────────────────────────────────────────
            {
                title: 'The North Face Mountain 25 Tent',
                category: 'Outdoors',
                pricePerDay: 1500,
                securityDeposit: 12000,
                condition: 'Good',
                rating: 4.8, reviewCount: 34,
                images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80'],
                description: 'Legendary 4-season expedition tent tested in the most extreme alpine environments. Can withstand winds up to 100mph.',
                specs: { capacity: '2-person', seasons: '4-season', weight: '5.9kg', waterproofing: '8000mm HH' }
            },
            {
                title: 'Garmin Fenix 7X Solar Smartwatch',
                category: 'Outdoors',
                pricePerDay: 800,
                securityDeposit: 7000,
                condition: 'Excellent',
                rating: 4.8, reviewCount: 49,
                images: ['https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?w=800&q=80'],
                description: 'Rugged GPS smartwatch with solar charging that extends battery life to 37 days. Features topographic maps, SOS, altimeter, and ABC sensors.',
                specs: { battery: '37 days (solar)', display: '1.4" MIP', sensors: 'ABC + Pulse Ox', gps: 'Multi-band GPS' }
            },
            {
                title: 'Osprey Aether 65 Hiking Pack',
                category: 'Outdoors',
                pricePerDay: 500,
                securityDeposit: 4000,
                condition: 'Good',
                rating: 4.7, reviewCount: 27,
                images: ['https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=800&q=80'],
                description: 'Award-winning technical hiking pack for multi-day adventures. Adjustable torso fit, integrated rain cover, and premium AirSpeed backpanel for ventilation.',
                specs: { volume: '65L', weight: '2.1kg', frame: 'Aluminum stay', hipbelt: 'Removable' }
            },
            {
                title: 'Sea Eagle 370 Pro Inflatable Kayak',
                category: 'Outdoors',
                pricePerDay: 1200,
                securityDeposit: 9000,
                condition: 'Good',
                rating: 4.6, reviewCount: 18,
                images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'],
                description: 'Portable, highly durable inflatable kayak for 2-person freshwater and saltwater paddling. Includes paddles, pump, and carry bag.',
                specs: { length: '11 ft', capacity: '635 lbs', weight: '13.6kg', material: 'K80 Korean polykrylar' }
            },
            {
                title: 'Nemo Tensor Ultralight Sleeping Pad',
                category: 'Outdoors',
                pricePerDay: 300,
                securityDeposit: 2500,
                condition: 'New',
                rating: 4.8, reviewCount: 22,
                images: ['https://images.unsplash.com/photo-1510662145379-13537db782dc?w=800&q=80'],
                description: 'Premium ultralight sleeping pad with whisper-quiet insulation. R-value of 4.2 makes it perfect for 3-season camping in cold environments.',
                specs: { rValue: '4.2', weight: '420g', dimensions: '183x51cm', packSize: '25x10cm' }
            },
            {
                title: 'GoPro Hero 12 Black Action Camera',
                category: 'Outdoors',
                pricePerDay: 700,
                securityDeposit: 5000,
                condition: 'New',
                rating: 4.7, reviewCount: 83,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'],
                description: 'Capture every adventure in stunning 5.3K. Waterproof to 10m, HyperSmooth 6.0 stabilization, and unlimited recording with all-new log lenses.',
                specs: { resolution: '5.3K 60fps', stabilization: 'HyperSmooth 6.0', waterproof: '10m', battery: '70min @ 5.3K' }
            },

            // ─── GAMING ─────────────────────────────────────────────
            {
                title: 'Custom ASUS RTX 4090 Gaming PC',
                category: 'Gaming',
                pricePerDay: 5000,
                securityDeposit: 40000,
                condition: 'New',
                rating: 4.9, reviewCount: 31,
                images: ['https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80'],
                description: 'i9-14900K @ 6GHz, RTX 4090 24GB, 64GB DDR5 RAM. Handles 4K gaming at 240fps and handles AI workloads with ease.',
                specs: { cpu: 'Intel i9-14900K', gpu: 'RTX 4090 24GB', ram: '64GB DDR5 6000MHz', storage: '4TB NVMe' }
            },
            {
                title: 'PlayStation 5 Disc Edition Bundle',
                category: 'Gaming',
                pricePerDay: 1200,
                securityDeposit: 15000,
                condition: 'Excellent',
                rating: 4.7, reviewCount: 112,
                images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80'],
                description: 'Next-gen gaming at 4K 120fps. Bundle includes 2 DualSense controllers, PSVR2 headset, and 5 blockbuster titles. Setup and ready to play.',
                specs: { resolution: '4K 120fps', storage: '2TB SSD', ray_tracing: 'Yes', controllers: '2x DualSense' }
            },
            {
                title: 'Fanatec Gran Turismo DD Pro Bundle',
                category: 'Gaming',
                pricePerDay: 4000,
                securityDeposit: 25000,
                condition: 'Excellent',
                rating: 4.8, reviewCount: 14,
                images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'],
                description: 'Official GT7 direct-drive wheel with load-cell pedals, handbrake, and Playseat Revolution racing seat. The most realistic sim-racing setup available.',
                specs: { wheel: 'Fanatec Gran Turismo DD Pro 8Nm', pedals: 'ClubSport V3 inverted', shifter: 'H-pattern + sequential', seat: 'Playseat Revolution' }
            },
            {
                title: 'Alienware 34" QD-OLED Gaming Monitor',
                category: 'Gaming',
                pricePerDay: 2500,
                securityDeposit: 18000,
                condition: 'New',
                rating: 4.9, reviewCount: 45,
                images: ['https://images.unsplash.com/photo-1593642632816-92c864f0b8fa?w=800&q=80'],
                description: '34-inch curved QD-OLED with 165Hz refresh rate, 0.1ms response time, and 1800R curvature. Dolby Vision gaming. The ultimate gaming display.',
                specs: { size: '34" curved', panel: 'QD-OLED', refresh: '165Hz', resolution: '3440x1440' }
            },
            {
                title: 'Xbox Series X + 40 Game Library',
                category: 'Gaming',
                pricePerDay: 1000,
                securityDeposit: 12000,
                condition: 'Good',
                rating: 4.6, reviewCount: 77,
                images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80'],
                description: 'Xbox Series X console with Game Pass Ultimate and 40-game physical collection. Includes 2 Xbox Wireless controllers and Astro A50 headset.',
                specs: { resolution: '4K 120fps', storage: '2TB SSD', game_pass: 'Game Pass Ultimate', controllers: '2x Xbox Wireless' }
            },

            // ─── AUTOMOTIVE ──────────────────────────────────────────
            {
                title: 'Tesla Model S Plaid (Weekend Hire)',
                category: 'Automotive',
                pricePerDay: 35000,
                securityDeposit: 150000,
                condition: 'New',
                rating: 4.9, reviewCount: 21,
                images: ['https://images.unsplash.com/photo-1617788138017-80ad42243c59?w=800&q=80'],
                description: '1,020hp tri-motor. 0-100km/h in 2.1 seconds. Full Self-Driving enabled. The fastest accelerating production car ever made.',
                specs: { hp: '1020hp', acceleration: '0-100 in 2.1s', range: '637km', charging: 'V3 Supercharger (250kW)' }
            },
            {
                title: 'Porsche 911 Carrera S Cabriolet',
                category: 'Automotive',
                pricePerDay: 45000,
                securityDeposit: 200000,
                condition: 'Excellent',
                rating: 4.9, reviewCount: 17,
                images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'],
                description: 'The iconic 911 in open-top form. 450hp twin-turbo flat-six, 8-speed PDK, and Sport Chrono package. The perfect machine for spirited weekend drives.',
                specs: { engine: '3.0L Twin-Turbo Flat-6', hp: '450hp', transmission: '8-speed PDK', acceleration: '0-100 in 3.7s' }
            },
            {
                title: 'Jeep Wrangler Rubicon 4xe',
                category: 'Automotive',
                pricePerDay: 15000,
                securityDeposit: 80000,
                condition: 'Good',
                rating: 4.6, reviewCount: 34,
                images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'],
                description: 'The worlds most capable off-road PHEV. Dana 44 axles, 35" Goodyear tires, and electric motor for silent trail cruising. Perfect for overlanding.',
                specs: { drivetrain: '4WD + PHEV', hp: '375hp', clearance: '10.8 inches', tires: '35" Goodyear Wrangler' }
            },
            {
                title: 'BMW M4 Competition xDrive',
                category: 'Automotive',
                pricePerDay: 28000,
                securityDeposit: 120000,
                condition: 'New',
                rating: 4.8, reviewCount: 26,
                images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'],
                description: '510hp S58 engine with xDrive AWD for all-weather performance. M Carbon ceramic brakes, M race track mode, and Launch Control. Pure track-bred excitement.',
                specs: { engine: '3.0L S58 Twin-Turbo I6', hp: '510hp', transmission: '8-speed M Steptronic', acceleration: '0-100 in 3.5s' }
            },
            {
                title: 'Range Rover Sport HST',
                category: 'Automotive',
                pricePerDay: 22000,
                securityDeposit: 100000,
                condition: 'Excellent',
                rating: 4.7, reviewCount: 19,
                images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'],
                description: 'The definitive luxury performance SUV. 395hp inline-6 with 48V mild hybrid, Dynamic Air Suspension, and Terrain Response 2. Business class for off-road.',
                specs: { engine: '3.0L Inline-6 MHEV', hp: '395hp', offroad: 'Terrain Response 2', suspension: 'Dynamic Air' }
            },
            {
                title: 'Ducati Panigale V4 S',
                category: 'Automotive',
                pricePerDay: 12000,
                securityDeposit: 80000,
                condition: 'Excellent',
                rating: 4.8, reviewCount: 13,
                images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80'],
                description: 'The benchmark of superbikes. 214hp Desmosedici Stradale V4 engine with titanium exhaust. Öhlins Smart EC 2.0 suspension and Brembo Stylema calipers.',
                specs: { engine: '1103cc V4 Desmoqualre', hp: '214hp', torque: '124Nm', weight: '198kg dry' }
            },

            // ─── HOME & LIFESTYLE ────────────────────────────────────
            {
                title: 'Dyson V15 Detect Vacuum',
                category: 'Home',
                pricePerDay: 1000,
                securityDeposit: 7000,
                condition: 'New',
                rating: 4.7, reviewCount: 58,
                images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80'],
                description: 'Laser-guided vacuum that reveals microscopic dust invisible to the naked eye. Automatically adapts suction based on debris type detected.',
                specs: { suction: '230 AW', battery: '60 min', filtration: 'HEPA filtered', laser: 'Green Laser Slim' }
            },
            {
                title: 'Breville Barista Express Espresso',
                category: 'Home',
                pricePerDay: 1200,
                securityDeposit: 10000,
                condition: 'Excellent',
                rating: 4.8, reviewCount: 41,
                images: ['https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=800&q=80'],
                description: 'Professional café-quality espresso at home. Built-in conical burr grinder, 67-step grind adjustment, and third-wave steep-and-release technology.',
                specs: { pump: '15 bar Italian pump', grinder: 'Conical Burr', temperature: 'PID control', tank: '2L removable' }
            },
            {
                title: 'Segway Ninebot Max G2 Scooter',
                category: 'Home',
                pricePerDay: 1500,
                securityDeposit: 8000,
                condition: 'Good',
                rating: 4.6, reviewCount: 35,
                images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
                description: 'High-performance electric scooter for urban commuters. 70km range, 25km/h top speed, and dual mechanical disc brakes for reliable stopping.',
                specs: { range: '70km', topSpeed: '25km/h', motor: '900W', brakes: 'Dual disc' }
            },
            {
                title: 'Weber Genesis E-435 Gas Grill',
                category: 'Home',
                pricePerDay: 2000,
                securityDeposit: 12000,
                condition: 'Good',
                rating: 4.7, reviewCount: 29,
                images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'],
                description: 'Professional 4-burner gas grill with 10,600 BTU sear zone and Infinity ignition. Perfect for backyard events, parties, and catering setups.',
                specs: { burners: '4 main + sear zone', btu: '48400 BTU total', area: '1066 sq in cooking', ignition: 'Infinity ignition' }
            },
            {
                title: 'DJI Mini 4 Pro Fly More Combo',
                category: 'Electronics',
                pricePerDay: 2500,
                securityDeposit: 18000,
                condition: 'New',
                rating: 4.8, reviewCount: 56,
                images: ['https://images.unsplash.com/photo-1521405305731-9e6ba6fe5e1a?w=800&q=80'],
                description: 'Sub-250g drone with 4K 100fps video. No license required. Omnidirectional obstacle sensing, 34-minute flight time, and 20km HD video transmission.',
                specs: { weight: '<250g', camera: '4K 100fps', range: '20km', flight_time: '34 min' }
            },
            {
                title: 'Insta360 X4 360° Camera',
                category: 'Electronics',
                pricePerDay: 1800,
                securityDeposit: 12000,
                condition: 'New',
                rating: 4.7, reviewCount: 47,
                images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80'],
                description: '8K 360° video camera that captures everything. Waterproof to 10m, Me Mode invisible selfie stick, and AI-powered editing in the app.',
                specs: { resolution: '8K 360°', waterproof: '10m', stabilization: 'FlowState 6-axis', battery: '135min @ 5.7K' }
            },
            {
                title: 'Rolex Submariner (Date) - Black',
                category: 'Home',
                pricePerDay: 5000,
                securityDeposit: 80000,
                condition: 'Excellent',
                rating: 5.0, reviewCount: 8,
                images: ['https://images.unsplash.com/photo-1523475496153-3e62f404f726?w=800&q=80'],
                description: 'The definitive diver\'s watch. Oystersteel case, Maxi dial, 300m water resistance, and 70-hour power reserve. For events, shoots, and special occasions.',
                specs: { movement: 'Cal. 3235 Perpetual', case: '41mm Oystersteel', water: '300m / 1000ft', power: '70hr reserve' }
            },
            {
                title: 'Leica Q3 Digital Camera',
                category: 'Electronics',
                pricePerDay: 8000,
                securityDeposit: 60000,
                condition: 'Excellent',
                rating: 4.9, reviewCount: 16,
                images: ['https://images.unsplash.com/photo-1495121605193-b116b5b9c140?w=800&q=80'],
                description: 'The world-class full-frame 60MP compact camera. Legendary Summilux 28mm f/1.7 ASPH lens, OLED viewfinder, and weather-sealed Magnesium body.',
                specs: { sensor: '60MP full-frame BSI CMOS', lens: 'Summilux 28mm f/1.7', iso: 'Up to 100000', video: '8K video' }
            },
        ];

        const conditions = ['New', 'Excellent', 'Good'];
        const writeBatch = db.batch();
        products.forEach((p, i) => {
            const docRef = db.collection('products').doc();
            writeBatch.set(docRef, {
                merchant: merchantId,
                title: p.title,
                description: p.description,
                category: p.category,
                pricePerDay: p.pricePerDay,
                securityDeposit: p.securityDeposit,
                condition: p.condition || conditions[i % 3],
                images: p.images,
                rating: p.rating || parseFloat((4.4 + Math.random() * 0.6).toFixed(1)),
                reviewCount: p.reviewCount || Math.floor(Math.random() * 80) + 10,
                specs: p.specs || {},
                verified: true,
                status: 'AVAILABLE',
                createdAt: new Date().toISOString()
            });
        });

        await writeBatch.commit();
        console.log(`✅ LendeX Premium Seed v2 Complete: ${products.length} rich listings seeded.`);
        process.exit();
    } catch (error) {
        console.error('❌ Seed Error:', error);
        process.exit(1);
    }
};

seedData();
