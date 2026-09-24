package com.daymes.medicare.service;

import com.daymes.medicare.model.CartItem;
import com.daymes.medicare.model.Medicine;
import com.daymes.medicare.dto.CartItemRequest;
import com.daymes.medicare.dto.CartResponse;
import com.daymes.medicare.repository.CartRepository;
import com.daymes.medicare.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service to manage the user's shopping cart.
 */
@Service
public class CartService {
    private final CartRepository cartRepository;
    private final MedicineRepository medicineRepository;

    public CartService(CartRepository cartRepository, MedicineRepository medicineRepository) {
        this.cartRepository = cartRepository;
        this.medicineRepository = medicineRepository;
    }

    // Helper function to build a rich cart response with calculated totals
    public CartResponse buildCartResponse(String userId) {
        List<CartItem> items = cartRepository.getCart(userId);
        
        double subtotal = 0;
        for (CartItem item : items) {
            subtotal += (item.getPrice() * item.getQty());
        }
        
        // Shipping logic: free if subtotal > 300, else 40
        double shipping = subtotal > 300 || subtotal == 0 ? 0 : 40;
        double total = subtotal + shipping;
        
        CartResponse response = new CartResponse();
        response.setItems(items);
        response.setSubtotal(subtotal);
        response.setShipping(shipping);
        response.setTotal(total);
        
        return response;
    }

    // Gets the current state of the user's cart
    public CartResponse getCart(String userId) {
        return buildCartResponse(userId);
    }

    // Adds a medicine to the cart or increments its quantity if already there
    public CartResponse addToCart(String userId, CartItemRequest req) {
        Medicine med = medicineRepository.findById(req.getProductId());
        if (med == null) {
            return buildCartResponse(userId); // Product not found, ignore
        }

        List<CartItem> items = cartRepository.getCart(userId);
        boolean found = false;
        
        // Check if item is already in the cart
        for (CartItem item : items) {
            if (item.getProductId().equals(req.getProductId())) {
                item.setQty(item.getQty() + req.getQty());
                found = true;
                break;
            }
        }
        
        // If not found, create a new cart item
        if (!found) {
            CartItem newItem = new CartItem();
            newItem.setProductId(med.getId());
            newItem.setName(med.getName());
            newItem.setPrice(med.getPrice());
            newItem.setImage(med.getImage());
            newItem.setRequiresRx(med.getRequiresRx());
            newItem.setQty(req.getQty());
            items.add(newItem);
        }
        
        cartRepository.saveCart(userId, items);
        return buildCartResponse(userId);
    }

    // Updates the quantity of a specific item in the cart
    public CartResponse updateCartItem(String userId, String productId, int qty) {
        List<CartItem> items = cartRepository.getCart(userId);
        
        if (qty <= 0) {
            items.removeIf(i -> i.getProductId().equals(productId));
        } else {
            for (CartItem item : items) {
                if (item.getProductId().equals(productId)) {
                    item.setQty(qty);
                    break;
                }
            }
        }
        
        cartRepository.saveCart(userId, items);
        return buildCartResponse(userId);
    }

    // Removes a specific item from the cart completely
    public CartResponse removeFromCart(String userId, String productId) {
        List<CartItem> items = cartRepository.getCart(userId);
        items.removeIf(i -> i.getProductId().equals(productId));
        cartRepository.saveCart(userId, items);
        return buildCartResponse(userId);
    }

    // Clears all items from the user's cart
    public void clearCart(String userId) {
        cartRepository.clearCart(userId);
    }
}
