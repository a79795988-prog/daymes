package com.daymes.medicare.model;

/**
 * Represents a reminder schedule for a medicine.
 */
public class MedicationSchedule {
    private String id;
    private String userId;
    private String medicine;
    private String time;
    private String instruction;
    private String status;
    private String statusBadge;

    public MedicationSchedule() {}

    public MedicationSchedule(String id, String userId, String medicine, String time, String instruction, String status, String statusBadge) {
        this.id = id;
        this.userId = userId;
        this.medicine = medicine;
        this.time = time;
        this.instruction = instruction;
        this.status = status;
        this.statusBadge = statusBadge;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getMedicine() { return medicine; }
    public void setMedicine(String medicine) { this.medicine = medicine; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStatusBadge() { return statusBadge; }
    public void setStatusBadge(String statusBadge) { this.statusBadge = statusBadge; }

    @Override
    public String toString() { return "MedicationSchedule{id='" + id + "'}"; }
}
