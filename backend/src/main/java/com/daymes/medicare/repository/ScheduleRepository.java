package com.daymes.medicare.repository;

import com.daymes.medicare.model.MedicationSchedule;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class ScheduleRepository {
    private final ConcurrentHashMap<String, List<MedicationSchedule>> schedules = new ConcurrentHashMap<>();

    public List<MedicationSchedule> findByUserId(String userId) {
        return schedules.getOrDefault(userId, new ArrayList<>());
    }

    public void save(String userId, List<MedicationSchedule> items) {
        schedules.put(userId, new ArrayList<>(items));
    }

    public void addSchedule(String userId, MedicationSchedule schedule) {
        List<MedicationSchedule> userSchedules = schedules.computeIfAbsent(userId, k -> new ArrayList<>());
        userSchedules.add(schedule);
    }

    public Optional<MedicationSchedule> findById(String userId, String scheduleId) {
        List<MedicationSchedule> userSchedules = findByUserId(userId);
        return userSchedules.stream()
                .filter(s -> s.getId().equals(scheduleId))
                .findFirst();
    }
}
