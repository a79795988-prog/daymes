import { NextResponse } from 'next/server';
import { MEDICINES, MedicineItem } from '@/lib/data';

interface SuggestedMed {
  id: string;
  name: string;
  dosage: string;
  price: number;
  requiresRx: boolean;
  reason: string;
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const q = message.toLowerCase().trim();
    let text = '';
    let suggestedMedicines: SuggestedMed[] = [];
    let quickPrompts: string[] = [];

    // 1. FEVER / HIGH TEMPERATURE / CHILLS
    if (
      q.includes('fever') ||
      q.includes('temperature') ||
      q.includes('feverish') ||
      q.includes('chills') ||
      q.includes('shivering') ||
      q.includes('hot head') ||
      q.includes('viral')
    ) {
      text = `🌡️ **Recommendation for Fever & Temperature:**

For mild-to-moderate fever, **Paracetamol 500mg** (Acetaminophen) is the first-line antipyretic fever reducer and body ache reliever.

• **Standard Adult Dosage:** 1 to 2 tablets (500mg - 1000mg) every 4 to 6 hours with a glass of water as needed.
• **Maximum Safe Limit:** Do not exceed 8 tablets (4,000mg) in 24 hours.
• **Alternative / Adjunct:** If muscular inflammation is also present, **Ibuprofen 400mg** may be used as an alternative (always take with food).

💡 **Care Instructions:**
1. Drink plenty of water, broth, or ORS electrolyte solutions to prevent dehydration.
2. Rest in a well-ventilated, comfortable room with light clothing.
3. ⚠️ **Doctor Warning:** If your fever exceeds 102°F (38.9°C) or lasts longer than 3 days, consult a physician promptly.`;

      const paracetamol = MEDICINES.find((m) => m.id === 'med-000');
      const ibuprofen = MEDICINES.find((m) => m.id === 'med-004');

      if (paracetamol) {
        suggestedMedicines.push({
          id: paracetamol.id,
          name: paracetamol.name,
          dosage: paracetamol.dosage,
          price: paracetamol.price,
          requiresRx: paracetamol.requiresRx,
          reason: 'Primary fast-acting fever reducer and ache reliever',
        });
      }
      if (ibuprofen) {
        suggestedMedicines.push({
          id: ibuprofen.id,
          name: ibuprofen.name,
          dosage: ibuprofen.dosage,
          price: ibuprofen.price,
          requiresRx: ibuprofen.requiresRx,
          reason: 'Effective for fever accompanied by muscle/body pain',
        });
      }

      quickPrompts = ['Mild fever (< 100°F)', 'High fever (> 102°F)', 'Fever for 3+ days', 'Book Doctor Consult'];
    }

    // 2. HEADACHE / BODY PAIN / TOOTHACHE / MUSCLE ACHE
    else if (
      q.includes('headache') ||
      q.includes('head pain') ||
      q.includes('body ache') ||
      q.includes('toothache') ||
      q.includes('muscle pain') ||
      q.includes('backache') ||
      q.includes('migraine')
    ) {
      text = `💊 **Recommendation for Pain & Headache Relief:**

For effective pain relief, you can use:
1. **Paracetamol 500mg**: Gentle on the stomach; ideal for tension headaches, body aches, and tooth pain. Take 1 tablet every 4–6 hours as needed.
2. **Ibuprofen 400mg**: Fast-acting non-steroidal anti-inflammatory (NSAID); optimal for throbbing toothaches, swelling, or muscular strain. Take with food or milk.

⚠️ **Caution:** Do not combine multiple NSAIDs, and avoid taking paracetamol in excess of 4,000mg per day.`;

      const paracetamol = MEDICINES.find((m) => m.id === 'med-000');
      const ibuprofen = MEDICINES.find((m) => m.id === 'med-004');
      if (paracetamol) {
        suggestedMedicines.push({
          id: paracetamol.id,
          name: paracetamol.name,
          dosage: paracetamol.dosage,
          price: paracetamol.price,
          requiresRx: false,
          reason: 'Relieves headaches and body tension gently',
        });
      }
      if (ibuprofen) {
        suggestedMedicines.push({
          id: ibuprofen.id,
          name: ibuprofen.name,
          dosage: ibuprofen.dosage,
          price: ibuprofen.price,
          requiresRx: false,
          reason: 'Reduces inflammation, joint & muscle pain',
        });
      }
      quickPrompts = ['Migraine pain', 'Toothache relief', 'Take with food?'];
    }

    // 3. COLD / ALLERGY / RUNNY NOSE / SNEEZING / HAY FEVER
    else if (
      q.includes('cold') ||
      q.includes('allergy') ||
      q.includes('allergic') ||
      q.includes('sneezing') ||
      q.includes('runny nose') ||
      q.includes('hay fever') ||
      q.includes('itchy eyes') ||
      q.includes('hives')
    ) {
      text = `🤧 **Recommendation for Cold & Allergy Relief:**

For allergic rhinitis, sneezing, and runny nose, **Cetirizine HCl 10mg** (Zyrtec) is the recommended 24-hour non-drowsy antihistamine.

• **Dosage:** 1 tablet (10mg) once daily with water.
• **Onset:** Starts working within 20–60 minutes and provides full 24-hour protection.
• **For Associated Fever/Aches:** You may pair it with **Paracetamol 500mg**.

💡 **Self-Care Tips:** Use steam inhalation, saline nasal rinse, and stay warm and well-hydrated.`;

      const cetirizine = MEDICINES.find((m) => m.id === 'med-006');
      if (cetirizine) {
        suggestedMedicines.push({
          id: cetirizine.id,
          name: cetirizine.name,
          dosage: cetirizine.dosage,
          price: cetirizine.price,
          requiresRx: false,
          reason: '24-hour non-drowsy allergy & cold relief',
        });
      }
      quickPrompts = ['Add Paracetamol for body ache', 'Non-drowsy formula', 'Steam inhalation tips'];
    }

    // 4. COUGH / SORE THROAT / CHEST CONGESTION
    else if (q.includes('cough') || q.includes('sore throat') || q.includes('throat pain') || q.includes('congestion')) {
      text = `🫁 **Recommendation for Cough & Sore Throat:**

• **For Dry Cough & Throat Irritation:** Use soothing throat lozenges and warm salt water gargles (1/2 tsp salt in warm water, 3x daily).
• **For Fever & Throat Pain:** **Paracetamol 500mg** helps relieve throat soreness and reduces accompanying fever.
• **Hydration:** Warm honey-lemon tea or herbal infusions help thin mucus and soothe inflamed airways.

⚠️ **Doctor Warning:** If you experience shortness of breath, blood in cough, or persistent coughing over 10 days, book a doctor consultation.`;

      const paracetamol = MEDICINES.find((m) => m.id === 'med-000');
      if (paracetamol) {
        suggestedMedicines.push({
          id: paracetamol.id,
          name: paracetamol.name,
          dosage: paracetamol.dosage,
          price: paracetamol.price,
          requiresRx: false,
          reason: 'Eases throat discomfort and fever',
        });
      }
      quickPrompts = ['Consult Doctor', 'Dry cough remedies', 'Sore throat relief'];
    }

    // 5. BACTERIAL INFECTION / ANTIBIOTICS
    else if (q.includes('infection') || q.includes('antibiotic') || q.includes('amoxicillin')) {
      text = `🔬 **Information on Antibiotics & Infections:**

**Amoxicillin 500mg** is a broad-spectrum penicillin antibiotic used to treat bacterial infections of the respiratory tract, ear, and throat.

• **Important:** Antibiotics require a valid doctor prescription (Rx). They are ineffective against viral illnesses like the common cold or flu.
• **Course Compliance:** Always finish the complete course prescribed by your physician to prevent antibiotic resistance.`;

      const amox = MEDICINES.find((m) => m.id === 'med-001');
      if (amox) {
        suggestedMedicines.push({
          id: amox.id,
          name: amox.name,
          dosage: amox.dosage,
          price: amox.price,
          requiresRx: true,
          reason: 'Bacterial infection treatment (Rx Required)',
        });
      }
      quickPrompts = ['Upload Prescription', 'Consult Doctor'];
    }

    // 6. DIABETES / BLOOD SUGAR
    else if (q.includes('diabetes') || q.includes('sugar') || q.includes('metformin')) {
      text = `🩸 **Recommendation for Blood Glucose Control:**

**Metformin HCl 500mg** is the first-line prescription therapy for type 2 diabetes management, helping improve insulin sensitivity and glycemic control.

• **Usage:** Take with morning and evening meals to minimize GI side effects.
• **Monitoring:** Regularly record fasting and post-prandial blood glucose.
• **Rx Notice:** Prescription verification required by our pharmacist before dispatch.`;

      const met = MEDICINES.find((m) => m.id === 'med-003');
      if (met) {
        suggestedMedicines.push({
          id: met.id,
          name: met.name,
          dosage: met.dosage,
          price: met.price,
          requiresRx: true,
          reason: 'Regulates blood glucose (Rx Required)',
        });
      }
      quickPrompts = ['Upload Doctor Prescription', 'Reorder Metformin'];
    }

    // 7. CHOLESTEROL / HEART / BLOOD PRESSURE
    else if (q.includes('cholesterol') || q.includes('heart') || q.includes('blood pressure') || q.includes('atorvastatin') || q.includes('lipitor')) {
      text = `❤️ **Recommendation for Cardiovascular & Cholesterol Health:**

**Atorvastatin 20mg** (Lipitor) is a proven statin that reduces LDL cholesterol and lowers cardiovascular event risks.

• **Dosage:** 1 tablet once daily in the evening.
• **Lifestyle:** Maintain a low saturated-fat diet and stay active.
• **Rx Notice:** Prescription verification is required.`;

      const atorv = MEDICINES.find((m) => m.id === 'med-002');
      if (atorv) {
        suggestedMedicines.push({
          id: atorv.id,
          name: atorv.name,
          dosage: atorv.dosage,
          price: atorv.price,
          requiresRx: true,
          reason: 'Lowers LDL cholesterol and protects heart health (Rx Required)',
        });
      }
      quickPrompts = ['Reorder Atorvastatin', 'Upload Prescription'];
    }

    // 8. VITAMINS / IMMUNITY / WEAKNESS / TIREDNESS
    else if (q.includes('vitamin') || q.includes('immunity') || q.includes('weakness') || q.includes('fatigue') || q.includes('energy')) {
      text = `☀️ **Recommendation for Daily Wellness & Immune Support:**

**Vitamin D3 5000 IU + K2** supports bone density, cardiovascular health, and daily immune system defense.

• **Dosage:** 1 softgel daily with a meal containing dietary healthy fats.
• **Benefit:** Synergistic D3 + K2 formulation ensures calcium absorption into bones rather than arterial walls.`;

      const vit = MEDICINES.find((m) => m.id === 'med-005');
      if (vit) {
        suggestedMedicines.push({
          id: vit.id,
          name: vit.name,
          dosage: vit.dosage,
          price: vit.price,
          requiresRx: false,
          reason: 'Boosts immune defenses and bone density',
        });
      }
      quickPrompts = ['Daily Dosage', 'Add to Cart'];
    }

    // 9. GENERAL / OTHER ILLNESSES
    else {
      text = `Hello! I am your DAYMES Healthcare Assistant 🩺.

For specific symptoms (such as **fever**, **headaches**, **body pain**, **allergies**, **cough**, or **vitamins**), I can recommend the appropriate verified medications, standard adult dosages, and clinical precautions.

How can I help you right now? Feel free to describe your illness or click one of the quick options below!`;

      quickPrompts = ['I have fever', 'Medicine for headache', 'Allergy & sneezing', 'Consult Doctor'];
    }

    return NextResponse.json({
      text,
      suggestedMedicines,
      quickPrompts,
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ error: 'Failed to process AI response' }, { status: 500 });
  }
}
