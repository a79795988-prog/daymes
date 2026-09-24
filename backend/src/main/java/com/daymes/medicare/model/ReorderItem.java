package com.daymes.medicare.model;

/**
 * Represents an item in the medicine cabinet for quick reordering.
 */
public class ReorderItem {
    private String id;
    private String productId;
    private String name;
    private String form;
    private String lastOrderDate;
    private int defaultQty;
    private double price;
    private boolean requiresRx;
    private String status;
    private String statusClass;
    private int daysRemaining;
    private boolean prescriptionValid;
    private String image;

    public ReorderItem() {}

    public ReorderItem(String id, String productId, String name, String form, String lastOrderDate, int defaultQty, double price, boolean requiresRx, String status, String statusClass, int daysRemaining, boolean prescriptionValid, String image) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.form = form;
        this.lastOrderDate = lastOrderDate;
        this.defaultQty = defaultQty;
        this.price = price;
        this.requiresRx = requiresRx;
        this.status = status;
        this.statusClass = statusClass;
        this.daysRemaining = daysRemaining;
        this.prescriptionValid = prescriptionValid;
        this.image = image;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getForm() { return form; }
    public void setForm(String form) { this.form = form; }
    public String getLastOrderDate() { return lastOrderDate; }
    public void setLastOrderDate(String lastOrderDate) { this.lastOrderDate = lastOrderDate; }
    public int getDefaultQty() { return defaultQty; }
    public void setDefaultQty(int defaultQty) { this.defaultQty = defaultQty; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public boolean isRequiresRx() { return requiresRx; }
    public void setRequiresRx(boolean requiresRx) { this.requiresRx = requiresRx; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStatusClass() { return statusClass; }
    public void setStatusClass(String statusClass) { this.statusClass = statusClass; }
    public int getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(int daysRemaining) { this.daysRemaining = daysRemaining; }
    public boolean isPrescriptionValid() { return prescriptionValid; }
    public void setPrescriptionValid(boolean prescriptionValid) { this.prescriptionValid = prescriptionValid; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    @Override
    public String toString() { return "ReorderItem{id='" + id + "'}"; }
}
