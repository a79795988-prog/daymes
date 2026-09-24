package com.daymes.medicare.model;

/**
 * Represents an item in a user's shopping cart.
 */
public class CartItem {
    private String productId;
    private String name;
    private double price;
    private String image;
    private boolean requiresRx;
    private int qty;

    public CartItem() {}

    public CartItem(String productId, String name, double price, String image, boolean requiresRx, int qty) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.image = image;
        this.requiresRx = requiresRx;
        this.qty = qty;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public boolean isRequiresRx() { return requiresRx; }
    public void setRequiresRx(boolean requiresRx) { this.requiresRx = requiresRx; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }

    @Override
    public String toString() { return "CartItem{productId='" + productId + "', qty=" + qty + '}'; }
}
