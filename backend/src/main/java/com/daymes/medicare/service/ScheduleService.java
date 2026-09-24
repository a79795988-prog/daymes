package com.daymes.medicare.service;

import com.daymes.medicare.model.MedicationSchedule;
import com.daymes.medicare.dto.ReminderRequest;
import com.daymes.medicare.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service to manage medication reminders and schedules.
 */
@Service
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    // Retrieves all medication schedules for a user
    public List<MedicationSchedule> getSchedule(String userId) {
        return scheduleRepository.findByUserId(userId);
    }

    // Adds a new medication reminder schedule
    public MedicationSchedule addReminder(String userId, ReminderRequest req) {
        MedicationSchedule schedule = new MedicationSchedule();
        schedule.setId("med-sch-" + System.currentTimeMillis());
        schedule.setUserId(userId);
        schedule.setMedicine(req.getMedicine());
        schedule.setTime(req.getTime());
        schedule.setInstruction(req.getInstruction());
        schedule.setStatus("Pending");
        schedule.setStatusBadge("bg-amber-950 text-amber-300 border-amber-800");

        scheduleRepository.addSchedule(userId, schedule);
        return schedule;
    }

    // Toggles the status of a schedule between Taken and Pending
    public MedicationSchedule toggleStatus(String userId, String scheduleId) {
        Optional<MedicationSchedule> scheduleOpt = scheduleRepository.findById(userId, scheduleId);
        if (scheduleOpt.isPresent()) {
            MedicationSchedule schedule = scheduleOpt.get();
            if ("Pending".equals(schedule.getStatus())) {
                schedule.setStatus("Taken");
                schedule.setStatusBadge("bg-emerald-950 text-emerald-400 border-emerald-800");
            } else {
                schedule.setStatus("Pending");
                schedule.setStatusBadge("bg-amber-950 text-amber-300 border-amber-800");
            }
            
            // Save the updated list
            List<MedicationSchedule> allSchedules = scheduleRepository.findByUserId(userId);
            scheduleRepository.save(userId, allSchedules);
            
            return schedule;
        }
        throw new RuntimeException("Schedule not found");
    }
}
