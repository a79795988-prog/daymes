package com.daymes.medicare.dto;

import com.daymes.medicare.model.CartItem;
import java.util.List;

public class CartResponse {
    private List<CartItem> items;
    private double subtotal;
    private double shipping;
    private double total;

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    public double getShipping() { return shipping; }
    public void setShipping(double shipping) { this.shipping = shipping; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
}
