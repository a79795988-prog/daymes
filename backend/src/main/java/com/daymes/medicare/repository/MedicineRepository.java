package com.daymes.medicare.repository;

import com.daymes.medicare.model.Medicine;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class MedicineRepository {
    private final ConcurrentHashMap<String, Medicine> medicines = new ConcurrentHashMap<>();

    public Medicine save(Medicine m) {
        medicines.put(m.getId(), m);
        return m;
    }

    public Optional<Medicine> findById(String id) {
        return Optional.ofNullable(medicines.get(id));
    }

    public List<Medicine> findAll() {
        return new ArrayList<>(medicines.values());
    }

    public void saveAll(List<Medicine> list) {
        for (Medicine m : list) {
            medicines.put(m.getId(), m);
        }
    }
}
