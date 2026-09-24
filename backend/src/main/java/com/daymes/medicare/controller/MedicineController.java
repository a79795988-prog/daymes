package com.daymes.medicare.controller;

import com.daymes.medicare.model.Medicine;
import com.daymes.medicare.service.MedicineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for medicine catalog endpoints. No authentication required.
 */
@RestController
@RequestMapping("/api/medicines")
public class MedicineController {
    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    // Retrieves all medicines, with optional search, category, and sort filters
    @GetMapping("/")
    public ResponseEntity<List<Medicine>> getAllMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(medicineService.getAllMedicines(search, category, sort));
    }

    // Retrieves a specific medicine by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable String id) {
        Optional<Medicine> medicine = medicineService.getMedicineById(id);
        if (medicine.isPresent()) {
            return ResponseEntity.ok(medicine.get());
        }
        return ResponseEntity.notFound().build();
    }

    // Searches for medicines using a query string
    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicines(@RequestParam String q) {
        return ResponseEntity.ok(medicineService.searchMedicines(q));
    }
}
