package com.daymes.medicare.config;

import com.daymes.medicare.model.*;
import com.daymes.medicare.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

@Component
public class DataInitializer implements CommandLineRunner {

    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ReorderRepository reorderRepository;
    private final ScheduleRepository scheduleRepository;

    public DataInitializer(MedicineRepository medicineRepository, UserRepository userRepository,
                           OrderRepository orderRepository, ReorderRepository reorderRepository,
                           ScheduleRepository scheduleRepository) {
        this.medicineRepository = medicineRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.reorderRepository = reorderRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public void run(String... args) {
        seedMedicines();
        seedDemoData();
        System.out.println("✅ DAYMES Medicare: Seeded 30 medicines, demo user, and sample data.");
    }

    private void seedMedicines() {
        String img = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80";
        List<Medicine> list = new ArrayList<>();
        list.add(new Medicine("prod-1", "Paracetamol 500 mg", "Paracetamol", "Tablet", Arrays.asList("Tylenol"), "Pain & Fever", 30.0, 4.8, 342, false, img, "Relieves pain and fever", "Fever", "1-2 tablets", "Avoid alcohol", "Nausea", "None", 150));
        list.add(new Medicine("prod-2", "Ibuprofen 400 mg", "Ibuprofen", "Tablet", Arrays.asList("Advil"), "Pain & Fever", 45.0, 4.7, 289, false, img, "Anti-inflammatory", "Pain", "1 tablet", "Take with food", "Stomach upset", "Aspirin", 200));
        list.add(new Medicine("prod-3", "Cetirizine 10 mg", "Cetirizine", "Tablet", Arrays.asList("Zyrtec"), "Allergy Relief", 25.0, 4.6, 198, false, img, "Allergy relief", "Allergy", "1 tablet daily", "May cause drowsiness", "Drowsiness", "Alcohol", 300));
        list.add(new Medicine("prod-4", "Oral Rehydration Salts (ORS)", "ORS", "Sachets", Arrays.asList("Electral"), "Hydration", 15.0, 4.9, 520, false, img, "Rehydration", "Dehydration", "1 sachet in water", "None", "None", "None", 500));
        list.add(new Medicine("prod-5", "Pantoprazole 40 mg", "Pantoprazole", "Tablet", Arrays.asList("Protonix"), "Digestive Health", 60.0, 4.5, 167, true, img, "Acid reducer", "Acidity", "1 tablet before meal", "None", "Headache", "None", 180));
        list.add(new Medicine("prod-6", "Vitamin C 1000 mg", "Ascorbic Acid", "Tablet", Arrays.asList("Vit C"), "Vitamins & Supplements", 120.0, 4.8, 445, false, img, "Immunity booster", "Immunity", "1 tablet daily", "None", "None", "None", 250));
        list.add(new Medicine("prod-7", "Azithromycin 500 mg", "Azithromycin", "Tablet", Arrays.asList("Zithromax"), "Cold & Throat Care", 85.0, 4.4, 134, true, img, "Antibiotic", "Infection", "1 tablet daily", "Complete course", "Stomach upset", "Antacids", 100));
        list.add(new Medicine("prod-8", "First Aid Kit (Complete)", "Kit", "Pack", Arrays.asList("First Aid"), "First Aid", 350.0, 4.9, 678, false, img, "Complete kit", "Emergency", "As needed", "None", "None", "None", 75));
        list.add(new Medicine("prod-9", "Digital Thermometer", "Thermometer", "Device", Arrays.asList("Temp Reader"), "Health Devices", 199.0, 4.7, 312, false, img, "Checks temp", "Fever", "As needed", "Keep clean", "None", "None", 120));
        list.add(new Medicine("prod-10", "Antiseptic Liquid 100ml", "Antiseptic", "Liquid", Arrays.asList("Dettol"), "First Aid", 55.0, 4.6, 234, false, img, "Cleans wounds", "Wounds", "Use externally", "Do not swallow", "None", "None", 400));
        
        list.add(new Medicine("prod-11", "Loperamide 2 mg", "Loperamide", "Tablet", Arrays.asList("Imodium"), "Digestive Health", 35.0, 4.3, 145, false, img, "Stops diarrhea", "Diarrhea", "2 tablets initial", "Drink fluids", "Constipation", "None", 220));
        list.add(new Medicine("prod-12", "Multivitamin Daily", "Multivitamin", "Tablet", Arrays.asList("Vitamins"), "Vitamins & Supplements", 180.0, 4.7, 567, false, img, "Daily nutrition", "Health", "1 tablet", "None", "None", "None", 300));
        list.add(new Medicine("prod-13", "Diclofenac Gel 1%", "Diclofenac", "Gel", Arrays.asList("Volini"), "Pain & Fever", 75.0, 4.5, 201, false, img, "Pain relief gel", "Muscle pain", "Apply locally", "External use", "Skin rash", "None", 160));
        list.add(new Medicine("prod-14", "Loratadine 10 mg", "Loratadine", "Tablet", Arrays.asList("Claritin"), "Allergy Relief", 40.0, 4.6, 178, false, img, "Allergy relief", "Allergy", "1 tablet", "None", "Dry mouth", "None", 280));
        list.add(new Medicine("prod-15", "Omeprazole 20 mg", "Omeprazole", "Tablet", Arrays.asList("Prilosec"), "Digestive Health", 50.0, 4.5, 223, true, img, "Acid reducer", "Acidity", "1 tablet", "None", "Headache", "None", 190));
        list.add(new Medicine("prod-16", "Throat Lozenges (Honey-Lemon)", "Lozenges", "Lozenge", Arrays.asList("Strepsils"), "Cold & Throat Care", 45.0, 4.4, 312, false, img, "Soothes throat", "Sore throat", "1 lozenge", "None", "None", "None", 350));
        list.add(new Medicine("prod-17", "Nasal Decongestant Spray", "Oxymetazoline", "Spray", Arrays.asList("Otrivin"), "Cold & Throat Care", 80.0, 4.3, 156, false, img, "Clears nose", "Blocked nose", "2 sprays", "Do not overuse", "Dryness", "None", 200));
        list.add(new Medicine("prod-18", "Calcium + Vitamin D3", "Calcium", "Tablet", Arrays.asList("Shelcal"), "Vitamins & Supplements", 150.0, 4.7, 389, false, img, "Bone health", "Bones", "1 tablet", "None", "Constipation", "None", 270));
        list.add(new Medicine("prod-19", "Hand Sanitizer 500ml", "Sanitizer", "Liquid", Arrays.asList("Purell"), "Personal Care", 99.0, 4.8, 890, false, img, "Kills germs", "Hygiene", "Apply on hands", "Flammable", "None", "None", 600));
        list.add(new Medicine("prod-20", "Cough Syrup (Adult)", "Dextromethorphan", "Liquid", Arrays.asList("Benadryl"), "Cold & Throat Care", 65.0, 4.4, 267, false, img, "Relieves cough", "Cough", "10ml", "May cause drowsiness", "Drowsiness", "None", 180));
        
        list.add(new Medicine("prod-21", "Blood Pressure Monitor", "BP Monitor", "Device", Arrays.asList("Omron"), "Health Devices", 1299.0, 4.8, 445, false, img, "Checks BP", "BP", "As directed", "None", "None", "None", 50));
        list.add(new Medicine("prod-22", "Omega-3 Fish Oil", "Omega 3", "Tablet", Arrays.asList("Fish Oil"), "Vitamins & Supplements", 220.0, 4.6, 334, false, img, "Heart health", "Heart", "1 tablet", "None", "Fishy burps", "None", 200));
        list.add(new Medicine("prod-23", "Hydrocortisone Cream 1%", "Hydrocortisone", "Cream", Arrays.asList("Cortizone"), "Skin Care", 65.0, 4.5, 189, false, img, "Reduces itch", "Skin rash", "Apply locally", "External use", "Thinning skin", "None", 150));
        list.add(new Medicine("prod-24", "Electrolyte Energy Drink", "Electrolytes", "Drink", Arrays.asList("Gatorade"), "Hydration", 25.0, 4.7, 456, false, img, "Energy boost", "Dehydration", "Drink", "None", "None", "None", 400));
        list.add(new Medicine("prod-25", "Zinc Supplements 50 mg", "Zinc", "Tablet", Arrays.asList("Zincon"), "Vitamins & Supplements", 90.0, 4.6, 278, false, img, "Immunity boost", "Immunity", "1 tablet", "Take with food", "Nausea", "None", 320));
        list.add(new Medicine("prod-26", "Pulse Oximeter", "Oximeter", "Device", Arrays.asList("Oximeter"), "Health Devices", 899.0, 4.7, 234, false, img, "Checks SpO2", "Oxygen", "Clip on finger", "None", "None", "None", 80));
        list.add(new Medicine("prod-27", "Muscle Pain Relief Roll", "Roll on", "Roll", Arrays.asList("Iodex"), "Pain & Fever", 110.0, 4.5, 198, false, img, "Pain relief", "Muscle pain", "Apply locally", "External use", "None", "None", 170));
        list.add(new Medicine("prod-28", "Lip Balm SPF 30", "Lip Balm", "Stick", Arrays.asList("Chapstick"), "Personal Care", 75.0, 4.4, 312, false, img, "Protects lips", "Dry lips", "Apply", "None", "None", "None", 250));
        list.add(new Medicine("prod-29", "Eye Drops (Lubricant)", "Eye Drops", "Drops", Arrays.asList("Refresh"), "Eye Care", 85.0, 4.6, 267, false, img, "Relieves dry eyes", "Dry eyes", "1-2 drops", "Do not touch tip", "Blurred vision", "None", 200));
        list.add(new Medicine("prod-30", "Antifungal Cream", "Clotrimazole", "Cream", Arrays.asList("Lotrimin"), "Skin Care", 95.0, 4.5, 156, false, img, "Treats fungus", "Infection", "Apply locally", "External use", "Redness", "None", 140));

        medicineRepository.saveAll(list);
    }

    private void seedDemoData() {
        String userId = "usr-demo";
        User user = new User(userId, "Sarah Jenkins", "sarah@example.com", "9876543210", 
                             "2a97516c354b68848cdbd8f54a226a0a55b21ed138e207ad6c5cbb9c00aa5aea", 
                             "local", null, null, true, "2023-01-01T00:00:00Z");
        userRepository.save(user);

        // Orders
        Order o1 = new Order("ord-1", userId, "2024-03-10", "Delivered", "bg-green-100 text-green-800", 120.0, 
                             Arrays.asList(new OrderItem("Vitamin C", 1, 120.0)), "123 Main St", "Card");
        Order o2 = new Order("ord-2", userId, "2024-04-12", "Delivered", "bg-green-100 text-green-800", 30.0, 
                             Arrays.asList(new OrderItem("Paracetamol 500 mg", 1, 30.0)), "123 Main St", "Cash");
        Order o3 = new Order("ord-3", userId, "2024-05-15", "Processing", "bg-blue-100 text-blue-800", 45.0, 
                             Arrays.asList(new OrderItem("Ibuprofen 400 mg", 1, 45.0)), "123 Main St", "UPI");
        orderRepository.saveAll(userId, Arrays.asList(o1, o2, o3));

        // Reorder items
        String img = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80";
        ReorderItem r1 = new ReorderItem("ri-1", "prod-1", "Paracetamol 500 mg", "Tablet", "2024-04-12", 2, 30.0, false, "Available", "text-green-600", 10, true, img);
        ReorderItem r2 = new ReorderItem("ri-2", "prod-5", "Pantoprazole 40 mg", "Tablet", "2024-03-01", 1, 60.0, true, "Rx Expiring", "text-orange-600", 5, true, img);
        ReorderItem r3 = new ReorderItem("ri-3", "prod-6", "Vitamin C 1000 mg", "Tablet", "2024-03-10", 1, 120.0, false, "Low Stock", "text-red-600", 2, true, img);
        ReorderItem r4 = new ReorderItem("ri-4", "prod-2", "Ibuprofen 400 mg", "Tablet", "2024-05-15", 1, 45.0, false, "Available", "text-green-600", 20, true, img);
        ReorderItem r5 = new ReorderItem("ri-5", "prod-4", "Oral Rehydration Salts (ORS)", "Sachets", "2024-01-20", 5, 15.0, false, "Available", "text-green-600", 30, true, img);
        reorderRepository.save(userId, Arrays.asList(r1, r2, r3, r4, r5));

        // Schedules
        MedicationSchedule s1 = new MedicationSchedule("ms-1", userId, "Pantoprazole 40 mg", "08:00 AM", "Before breakfast", "Taken", "bg-green-100 text-green-800");
        MedicationSchedule s2 = new MedicationSchedule("ms-2", userId, "Vitamin C 1000 mg", "09:00 AM", "After breakfast", "Pending", "bg-yellow-100 text-yellow-800");
        MedicationSchedule s3 = new MedicationSchedule("ms-3", userId, "Paracetamol 500 mg", "01:00 PM", "After lunch", "Pending", "bg-yellow-100 text-yellow-800");
        MedicationSchedule s4 = new MedicationSchedule("ms-4", userId, "Ibuprofen 400 mg", "08:00 PM", "After dinner", "Upcoming", "bg-gray-100 text-gray-800");
        MedicationSchedule s5 = new MedicationSchedule("ms-5", userId, "Multivitamin Daily", "09:00 PM", "Before bed", "Upcoming", "bg-gray-100 text-gray-800");
        scheduleRepository.save(userId, Arrays.asList(s1, s2, s3, s4, s5));
    }
}
