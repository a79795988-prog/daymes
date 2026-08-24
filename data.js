/**
 * DAYMES - Data Store (Enhanced with Detailed Medicine Knowledge, Side Effects & Interactions)
 */

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Paracetamol 500mg Extra Strength',
    aliases: ['paracetamol', 'panadol', 'acetaminophen', 'fever', 'headache pill'],
    category: 'Pain Relief',
    price: 4.99,
    rating: 4.8,
    reviews: 342,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'Fast-acting fever reducer and mild-to-moderate pain reliever for headaches, body aches, toothaches, and fever.',
    purpose: 'Relief of mild-to-moderate pain (headache, muscle ache, toothache) and fever reduction.',
    dosage: 'Standard adult usage: 1 tablet (500mg) every 4 to 6 hours as needed.',
    precautions: 'Do not exceed 4,000mg (8 tablets) in 24 hours. Avoid combining with other paracetamol-containing products or excessive alcohol to protect liver health. Consult a doctor if fever lasts over 3 days.',
    sideEffects: 'Rare when taken as directed. Occasional mild nausea or skin allergic rash. High overdose causes severe liver damage.',
    drugInteractions: 'May interact with warfarin or blood thinners when taken regularly over extended periods.',
    stock: 120
  },
  {
    id: 'prod-2',
    name: 'Vitamin C 1000mg + Zinc Effervescent',
    aliases: ['vitamin c', 'vit c', 'zinc', 'effervescent', 'immune', 'ascorbic acid'],
    category: 'Vitamins & Supplements',
    price: 12.50,
    rating: 4.9,
    reviews: 512,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80',
    description: 'High-potency immune support formula enriched with antioxidant Vitamin C and bio-available Zinc for daily energy.',
    purpose: 'Daily nutritional supplement to support immune defense, collagen synthesis, and antioxidant protection.',
    dosage: 'General usage: Dissolve 1 effervescent tablet in 200ml of cold drinking water once daily after a meal.',
    precautions: 'High doses may cause mild gastrointestinal upset in sensitive individuals. Do not exceed stated daily dose.',
    sideEffects: 'Mild stomach discomfort, abdominal bloating, or diarrhea if taken in excessive quantities.',
    drugInteractions: 'High doses of Vitamin C may increase iron absorption or interact with aluminum-containing antacids.',
    stock: 85
  },
  {
    id: 'prod-3',
    name: 'Complete Daily Multivitamin for Adults',
    aliases: ['multivitamin', 'multi vitamin', 'vitamins', 'daily vitamins', 'minerals'],
    category: 'Vitamins & Supplements',
    price: 18.99,
    rating: 4.7,
    reviews: 219,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80',
    description: 'Comprehensive 24-in-1 essential vitamins and minerals complex supporting heart, brain, bone, and immune health.',
    purpose: 'Fills dietary nutrition gaps, promotes metabolic energy, and supports general wellness.',
    dosage: 'General usage: Take 1 capsule daily with morning meal and water.',
    precautions: 'Contains iron; keep out of reach of young children. Take with food to minimize stomach sensitivity.',
    sideEffects: 'Mild stomach upset, brief nausea, or harmless darkening of stool color due to iron content.',
    drugInteractions: 'May decrease absorption of certain antibiotics (e.g. tetracyclines); space doses at least 2 hours apart.',
    stock: 64
  },
  {
    id: 'prod-4',
    name: 'Emergency First Aid Kit (120 Pieces)',
    aliases: ['first aid', 'first aid kit', 'bandage', 'gauze', 'emergency kit', 'wound care'],
    category: 'First Aid & Care',
    price: 24.99,
    rating: 4.9,
    reviews: 184,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
    description: 'Compact waterproof emergency case packed with medical-grade sterile bandages, antiseptic wipes, scissors, and gauze.',
    purpose: 'Immediate treatment of minor cuts, scrapes, burns, and home emergency wound care.',
    dosage: 'For topical external wound cleaning, dressing, and protection.',
    precautions: 'For deep wounds, severe bleeding, or signs of infection (redness, pus), seek immediate professional emergency medical care.',
    sideEffects: 'Rare localized allergic reaction to adhesive tape in individuals with latex or glue sensitivities.',
    drugInteractions: 'None for topical wound dressings.',
    stock: 45
  },
  {
    id: 'prod-5',
    name: 'Digital Infrared Forehead Thermometer',
    aliases: ['thermometer', 'digital thermometer', 'fever reader', 'infrared', 'temperature'],
    category: 'Medical Devices',
    price: 29.99,
    rating: 4.8,
    reviews: 420,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    description: 'Non-contact instant fever reader with color LCD backlight alert display and 32-reading memory recall.',
    purpose: 'Accurate, hygienic body temperature measurement without skin contact.',
    dosage: 'Hold sensor 1 to 3 cm from center of forehead and press scan button.',
    precautions: 'Ensure forehead is clean and dry. Allow device to acclimate to room temperature for 15 minutes before reading.',
    sideEffects: 'N/A (Non-invasive measurement device).',
    drugInteractions: 'None.',
    stock: 30
  },
  {
    id: 'prod-6',
    name: 'Antibacterial Hand Sanitizer Gel 500ml',
    aliases: ['hand sanitizer', 'sanitizer', 'rub', 'alcohol gel', 'hygiene'],
    category: 'Personal Hygiene',
    price: 6.75,
    rating: 4.6,
    reviews: 156,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=600&q=80',
    description: '75% Ethyl Alcohol rinse-free moisturizing gel infused with Aloe Vera extract. Rapidly eliminates 99.9% of germs.',
    purpose: 'Instant hand disinfection when soap and water are unavailable.',
    dosage: 'Dispense a coin-sized amount onto palm and rub hands together until dry.',
    precautions: 'For external use only. Flammable; keep away from open flame or heat sources. Avoid contact with eyes.',
    sideEffects: 'Temporary skin dryness or mild stinging sensation if applied to cut or irritated skin.',
    drugInteractions: 'None.',
    stock: 210
  },
  {
    id: 'prod-7',
    name: 'Omeprazole 20mg Heartburn Relief',
    aliases: ['omeprazole', 'heartburn', 'acid reflux', 'gerd', 'stomach acid', 'prilosec'],
    category: 'Prescription',
    price: 15.40,
    rating: 4.7,
    reviews: 98,
    requiresRx: true,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
    description: 'Proton pump inhibitor (PPI) treating frequent acid reflux, GERD, and stomach ulcers for 24-hour acid control.',
    purpose: 'Reduces stomach acid secretion for acid-related heartburn and erosive esophagitis.',
    dosage: 'Standard clinical dosage: 1 delayed-release capsule daily before morning meal.',
    precautions: 'Prescription medication requiring valid doctor authorization. Do not crush or chew capsules. Swallow whole with water.',
    sideEffects: 'Headache, abdominal discomfort, flatulence, nausea, diarrhea, or mild dizziness.',
    drugInteractions: 'Interacts with clopidogrel, ketoconazole, iron supplements, digoxin, and certain HIV medications.',
    stock: 50
  },
  {
    id: 'prod-8',
    name: 'Smart Arm Blood Pressure Monitor',
    aliases: ['blood pressure', 'bp monitor', 'sphygmomanometer', 'pulse monitor', 'bp cuff'],
    category: 'Medical Devices',
    price: 42.00,
    rating: 4.9,
    reviews: 310,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    description: 'Clinically validated automatic upper-arm pulse and blood pressure monitor with irregular heartbeat indicator.',
    purpose: 'Home monitoring of systolic/diastolic blood pressure and heart rate measurements.',
    dosage: 'Place cuff on upper arm at heart level while sitting quietly.',
    precautions: 'Rest for 5 minutes in a comfortable seated position prior to measurement. Avoid caffeine or exercise 30 mins before testing.',
    sideEffects: 'N/A (Non-invasive diagnostic cuff).',
    drugInteractions: 'None.',
    stock: 25
  },
  {
    id: 'prod-9',
    name: 'Cetirizine 10mg All-Day Allergy Relief',
    aliases: ['cetirizine', 'zyrtec', 'allergy', 'antihistamine', 'sneezing', 'runny nose'],
    category: 'Pain Relief',
    price: 9.99,
    rating: 4.8,
    reviews: 275,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80',
    description: 'Non-drowsy 24-hour allergy relief from hay fever, sneezing, runny nose, itchy eyes, and hives.',
    purpose: 'Antihistamine for seasonal and perennial allergic rhinitis symptom management.',
    dosage: 'Standard adult usage: 1 tablet (10mg) once daily with water.',
    precautions: 'May cause mild drowsiness in sensitive individuals. Avoid alcohol. Consult a doctor if you have kidney or liver conditions.',
    sideEffects: 'Mild drowsiness, dry mouth, tiredness, or mild headache.',
    drugInteractions: 'Sedative effects may increase if taken concurrently with alcohol, CNS depressants, or sedating medications.',
    stock: 90
  },
  {
    id: 'prod-10',
    name: 'Lubricating Eye Drops for Dry Eyes',
    aliases: ['eye drops', 'artificial tears', 'dry eyes', 'eye relief', 'lubricating drops'],
    category: 'Personal Hygiene',
    price: 8.25,
    rating: 4.7,
    reviews: 142,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'Sterile preservative-free soothing drops providing instant moisture and relief from screen fatigue and dryness.',
    purpose: 'Temporary relief of burning, irritation, and dryness of the eye.',
    dosage: 'Instill 1 to 2 drops in affected eye(s) as needed throughout the day.',
    precautions: 'Do not touch tip of container to any surface to avoid contamination. Replace cap after use. Discontinue if eye pain occurs.',
    sideEffects: 'Temporary mild blurred vision or transient eye stinging immediately following application.',
    drugInteractions: 'If using other ophthalmic medications, wait at least 5-10 minutes between applications.',
    stock: 75
  }
];

const INITIAL_REORDER_ITEMS = [
  {
    id: 'reorder-101',
    productId: 'prod-1',
    name: 'Paracetamol 500mg Extra Strength',
    lastOrderDate: '2026-07-28',
    defaultQty: 2,
    price: 4.99,
    requiresRx: false,
    status: 'Refill Due Soon',
    statusClass: 'refill-due',
    daysRemaining: 4,
    prescriptionValid: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'reorder-102',
    productId: 'prod-7',
    name: 'Omeprazole 20mg Heartburn Relief',
    lastOrderDate: '2026-07-15',
    defaultQty: 1,
    price: 15.40,
    requiresRx: true,
    status: 'Refill Available',
    statusClass: 'refill-available',
    daysRemaining: 12,
    prescriptionValid: true,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'reorder-103',
    productId: 'prod-2',
    name: 'Vitamin C 1000mg + Zinc Effervescent',
    lastOrderDate: '2026-08-10',
    defaultQty: 1,
    price: 12.50,
    requiresRx: false,
    status: 'Recently Ordered',
    statusClass: 'refill-recent',
    daysRemaining: 22,
    prescriptionValid: true,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'reorder-104',
    productId: 'prod-9',
    name: 'Cetirizine 10mg All-Day Allergy Relief',
    lastOrderDate: '2026-06-30',
    defaultQty: 1,
    price: 9.99,
    requiresRx: false,
    status: 'Refill Due Soon',
    statusClass: 'refill-due',
    daysRemaining: 2,
    prescriptionValid: true,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80'
  }
];

const INITIAL_ORDERS = [
  {
    orderId: 'DAY-89412',
    date: '2026-08-20',
    status: 'Out for Delivery',
    statusClass: 'status-out-for-delivery',
    total: 21.99,
    items: [
      { name: 'Vitamin C 1000mg + Zinc Effervescent', qty: 1, price: 12.50 },
      { name: 'Cetirizine 10mg All-Day Allergy Relief', qty: 1, price: 9.49 }
    ],
    address: '742 Evergreen Terrace, Springfield, IL',
    paymentMethod: 'UPI / Digital Wallet'
  },
  {
    orderId: 'DAY-84210',
    date: '2026-07-28',
    status: 'Delivered',
    statusClass: 'status-delivered',
    total: 9.98,
    items: [
      { name: 'Paracetamol 500mg Extra Strength', qty: 2, price: 4.99 }
    ],
    address: '742 Evergreen Terrace, Springfield, IL',
    paymentMethod: 'Credit Card (**** 4821)'
  },
  {
    orderId: 'DAY-76192',
    date: '2026-07-15',
    status: 'Delivered',
    statusClass: 'status-delivered',
    total: 15.40,
    items: [
      { name: 'Omeprazole 20mg Heartburn Relief', qty: 1, price: 15.40 }
    ],
    address: '742 Evergreen Terrace, Springfield, IL',
    paymentMethod: 'Cash on Delivery'
  }
];

const INITIAL_MEDICATION_SCHEDULE = [
  {
    id: 'med-sch-1',
    medicine: 'Paracetamol 500mg',
    time: '08:00 AM',
    instruction: '1 tablet after breakfast',
    status: 'Taken',
    statusBadge: 'bg-emerald-950 text-emerald-300 border-emerald-800'
  },
  {
    id: 'med-sch-2',
    medicine: 'Vitamin C 1000mg',
    time: '01:00 PM',
    instruction: '1 tablet dissolved in 200ml water',
    status: 'Pending',
    statusBadge: 'bg-amber-950 text-amber-300 border-amber-800'
  },
  {
    id: 'med-sch-3',
    medicine: 'Omeprazole 20mg',
    time: '08:00 PM',
    instruction: '1 capsule 30 mins before dinner',
    status: 'Pending',
    statusBadge: 'bg-slate-800 text-slate-300 border-slate-700'
  }
];

const FAQ_DATA = [
  {
    q: 'How do prescription orders work on DAYMES?',
    a: 'For prescription medicines (marked with an Rx badge), you can upload a digital copy of your doctor\'s prescription during checkout. Our licensed pharmacy team verifies all prescriptions before dispensing.'
  },
  {
    q: 'How does Smart Reordering work?',
    a: 'Our Smart Reordering system calculates your medication usage timeline based on your daily dosage. When your supply runs low, we highlight items marked as "Refill Due Soon" so you can reorder with a single click.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept major Credit & Debit Cards (Visa, MasterCard, Amex), UPI / Digital Wallets (Google Pay, Apple Pay), and Cash on Delivery (COD).'
  },
  {
    q: 'How fast is medicine delivery?',
    a: 'Standard delivery arrives within 24 to 48 hours. Express same-day pharmacy delivery is available for eligible zip codes when ordered before 2:00 PM.'
  },
  {
    q: 'Can I chat with a pharmacist directly?',
    a: 'Yes! You can use our DAYMES Assistant chatbot 24/7 or request a live callback from a verified pharmacist on our Contact page.'
  }
];
