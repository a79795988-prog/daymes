export interface MedicineItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  dosage: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  requiresRx: boolean;
  image: string;
  stock: number;
  description: string;
  composition?: string;
  instructions?: string;
}

export const CATEGORIES = [
  'All',
  'Prescription',
  'Pain Relief',
  'Antibiotics',
  'Cardiovascular',
  'Diabetes',
  'Vitamins & Supplements',
  'Cold & Allergy',
  'Digestive Health',
  'First Aid',
];

export const MEDICINES: MedicineItem[] = [
  {
    id: 'med-000',
    name: 'Paracetamol 500mg',
    brand: 'Panadol / Crocin • GSK',
    category: 'Pain Relief',
    dosage: '500mg Tablet (20 count)',
    price: 6.99,
    originalPrice: 9.50,
    rating: 4.9,
    reviewsCount: 420,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&h=300&q=80',
    stock: 150,
    description: 'First-line fast-acting fever reducer and mild-to-moderate pain reliever for headaches, body aches, toothaches, and viral fevers.',
    composition: 'Paracetamol / Acetaminophen 500mg',
    instructions: 'Take 1 to 2 tablets every 4 to 6 hours as needed with water. Do not exceed 8 tablets (4,000mg) in 24 hours.',
  },
  {
    id: 'med-001',
    name: 'Amoxicillin 500mg',
    brand: 'Amoxil • GlaxoSmithKline',
    category: 'Antibiotics',
    dosage: '500mg Capsule (30 count)',
    price: 18.99,
    originalPrice: 24.50,
    rating: 4.8,
    reviewsCount: 142,
    requiresRx: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&h=300&q=80',
    stock: 45,
    description: 'Broad-spectrum penicillin antibiotic used to treat bacterial infections of the respiratory tract, ear, and skin.',
    composition: 'Amoxicillin Trihydrate 500mg',
    instructions: 'Take 1 capsule three times daily every 8 hours with water. Complete entire course.',
  },
  {
    id: 'med-002',
    name: 'Atorvastatin 20mg',
    brand: 'Lipitor • Pfizer',
    category: 'Cardiovascular',
    dosage: '20mg Film-Coated Tablet (90 count)',
    price: 34.50,
    originalPrice: 42.00,
    rating: 4.9,
    reviewsCount: 230,
    requiresRx: true,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&h=300&q=80',
    stock: 60,
    description: 'Statin medication to lower low-density lipoprotein (LDL) cholesterol and reduce risk of heart attack and stroke.',
    composition: 'Atorvastatin Calcium 20mg',
    instructions: 'Take once daily at evening with or without meals.',
  },
  {
    id: 'med-003',
    name: 'Metformin HCl 500mg',
    brand: 'Glucophage • Bristol Myers',
    category: 'Diabetes',
    dosage: '500mg Extended Release (60 count)',
    price: 15.20,
    originalPrice: 19.99,
    rating: 4.7,
    reviewsCount: 188,
    requiresRx: true,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=400&h=300&q=80',
    stock: 75,
    description: 'First-line prescription medication for the treatment of type 2 diabetes mellitus to regulate blood glucose.',
    composition: 'Metformin Hydrochloride 500mg',
    instructions: 'Take with morning and evening meals to reduce gastrointestinal upset.',
  },
  {
    id: 'med-004',
    name: 'Ibuprofen 400mg Ultra',
    brand: 'Advil • Haleon',
    category: 'Pain Relief',
    dosage: '400mg Liquid Gel Softgels (50 count)',
    price: 11.49,
    originalPrice: 13.99,
    rating: 4.9,
    reviewsCount: 512,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&h=300&q=80',
    stock: 120,
    description: 'Fast-acting NSAID for relief of headache, fever, toothache, muscle aches, and inflammatory pain.',
    composition: 'Ibuprofen Solubilized 400mg',
    instructions: 'Take 1 softgel every 4 to 6 hours while symptoms persist. Do not exceed 3 in 24 hours.',
  },
  {
    id: 'med-005',
    name: 'Vitamin D3 5000 IU + K2',
    brand: 'VitaLife Health Labs',
    category: 'Vitamins & Supplements',
    dosage: '5000 IU Softgels (120 count)',
    price: 21.95,
    originalPrice: 28.00,
    rating: 4.9,
    reviewsCount: 410,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=400&h=300&q=80',
    stock: 85,
    description: 'High-potency cholecalciferol with MK-7 Menaquinone to support immune response, bone density, and arterial health.',
    composition: 'Cholecalciferol 5000 IU, MK-7 100mcg',
    instructions: 'Take 1 softgel daily with a meal containing healthy fats.',
  },
  {
    id: 'med-006',
    name: 'Cetirizine HCl 10mg All-Day',
    brand: 'Zyrtec • Johnson & Johnson',
    category: 'Cold & Allergy',
    dosage: '10mg Tablets (45 count)',
    price: 19.80,
    originalPrice: 23.50,
    rating: 4.8,
    reviewsCount: 310,
    requiresRx: false,
    image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?auto=format&fit=crop&w=400&h=300&q=80',
    stock: 90,
    description: '24-hour antihistamine providing non-drowsy relief from allergic rhinitis, pollen, hay fever, and hives.',
    composition: 'Cetirizine Hydrochloride 10mg',
    instructions: 'Take 1 tablet once daily with water. Do not exceed 1 tablet in 24 hours.',
  },
];
