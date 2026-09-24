package com.daymes.medicare.dto;

public class CartItemRequest {
    private String productId;
    private int qty;

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
}
