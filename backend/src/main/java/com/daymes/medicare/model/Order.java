package com.daymes.medicare.model;

import java.util.List;

/**
 * Represents a user order.
 */
public class Order {
    private String orderId;
    private String userId;
    private String date;
    private String status;
    private String statusClass;
    private double total;
    private List<OrderItem> items;
    private String address;
    private String paymentMethod;

    public Order() {}

    public Order(String orderId, String userId, String date, String status, String statusClass, double total, List<OrderItem> items, String address, String paymentMethod) {
        this.orderId = orderId;
        this.userId = userId;
        this.date = date;
        this.status = status;
        this.statusClass = statusClass;
        this.total = total;
        this.items = items;
        this.address = address;
        this.paymentMethod = paymentMethod;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStatusClass() { return statusClass; }
    public void setStatusClass(String statusClass) { this.statusClass = statusClass; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    @Override
    public String toString() { return "Order{orderId='" + orderId + "'}"; }
}
