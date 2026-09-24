package com.daymes.medicare.dto;

public class ReminderRequest {
    private String medicine;
    private String time;
    private String instruction;

    public String getMedicine() { return medicine; }
    public void setMedicine(String medicine) { this.medicine = medicine; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }
}
