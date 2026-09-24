package com.daymes.medicare.service;

import com.daymes.medicare.model.Medicine;
import com.daymes.medicare.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service to handle fetching and searching medicines.
 */
@Service
public class MedicineService {
    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    // Gets all medicines, with optional search, category filtering, and sorting
    public List<Medicine> getAllMedicines(String search, String category, String sort) {
        List<Medicine> all = medicineRepository.findAll();

        // 1. Filter by category
        if (category != null && !category.equalsIgnoreCase("All")) {
            all = all.stream()
                .filter(m -> category.equalsIgnoreCase(m.getCategory()))
                .collect(Collectors.toList());
        }

        // 2. Filter by search term
        if (search != null && !search.trim().isEmpty()) {
            String term = search.toLowerCase();
            all = all.stream()
                .filter(m -> 
                    (m.getName() != null && m.getName().toLowerCase().contains(term)) ||
                    (m.getGenericName() != null && m.getGenericName().toLowerCase().contains(term)) ||
                    (m.getDescription() != null && m.getDescription().toLowerCase().contains(term)) ||
                    (m.getForm() != null && m.getForm().toLowerCase().contains(term)) ||
                    (m.getPurpose() != null && m.getPurpose().toLowerCase().contains(term)) ||
                    (m.getAliases() != null && m.getAliases().stream().anyMatch(a -> a.toLowerCase().contains(term)))
                )
                .collect(Collectors.toList());
        }

        // 3. Sort the results
        String sortParam = sort == null ? "featured" : sort;
        all.sort((m1, m2) -> {
            switch (sortParam) {
                case "price-low":
                    return Double.compare(m1.getPrice(), m2.getPrice());
                case "price-high":
                    return Double.compare(m2.getPrice(), m1.getPrice());
                case "name-az":
                    String n1 = m1.getName() == null ? "" : m1.getName();
                    String n2 = m2.getName() == null ? "" : m2.getName();
                    return n1.compareToIgnoreCase(n2);
                case "availability":
                    return Boolean.compare(m2.getStock() > 0, m1.getStock() > 0);
                case "featured":
                default:
                    return Double.compare(m2.getRating(), m1.getRating());
            }
        });

        return all;
    }

    // Fetches a single medicine by its ID
    public Optional<Medicine> getMedicineById(String id) {
        return Optional.ofNullable(medicineRepository.findById(id));
    }

    // Searches for medicines using a specific query string
    public List<Medicine> searchMedicines(String query) {
        return getAllMedicines(query, null, null);
    }
}
