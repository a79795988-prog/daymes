package com.daymes.medicare.service;

import com.daymes.medicare.model.Order;
import com.daymes.medicare.model.OrderItem;
import com.daymes.medicare.model.CartItem;
import com.daymes.medicare.dto.OrderRequest;
import com.daymes.medicare.dto.CartResponse;
import com.daymes.medicare.repository.OrderRepository;
import com.daymes.medicare.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * Service to handle placing orders and managing order history.
 */
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final CartRepository cartRepository;

    public OrderService(OrderRepository orderRepository, CartService cartService, CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.cartRepository = cartRepository;
    }

    // Places a new order for the user based on their current cart contents
    public Order placeOrder(String userId, OrderRequest req) {
        CartResponse cart = cartService.getCart(userId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        // Generate a random order ID like DAY-12345
        Random random = new Random();
        int randomId = 10000 + random.nextInt(90000);
        order.setOrderId("DAY-" + randomId);
        order.setUserId(userId);
        
        // Set today's date formatted as yyyy-MM-dd
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        order.setDate(sdf.format(new Date()));
        
        order.setStatus("Confirmed");
        order.setStatusClass("status-confirmed");
        order.setTotal(cart.getTotal());
        
        // Convert cart items to order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setName(ci.getName());
            oi.setQty(ci.getQty());
            oi.setPrice(ci.getPrice());
            orderItems.add(oi);
        }
        order.setItems(orderItems);
        
        // Format the delivery address string
        String fullAddress = req.getAddress() + " (Recipient: " + req.getName() + ", Tel: " + req.getPhone() + ")";
        order.setAddress(fullAddress);
        order.setPaymentMethod(req.getPaymentMethod());
        
        // Save the new order and clear the user's cart
        orderRepository.save(userId, order);
        cartService.clearCart(userId);
        
        return order;
    }

    // Retrieves all orders placed by a specific user
    public List<Order> getOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }

    // Allows a user to easily reorder a past order by adding its items back to their cart
    public CartResponse reorderById(String userId, String orderId) {
        Optional<Order> orderOpt = orderRepository.findOrderById(userId, orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            List<CartItem> cartItems = cartRepository.getCart(userId);
            
            // For simplicity, we create cart items from order items. 
            // We assume required fields like productId are available or handle accordingly.
            for (OrderItem oi : order.getItems()) {
                CartItem ci = new CartItem();
                // Note: Realistically you'd look up the medicine by name here to get full details
                ci.setName(oi.getName());
                ci.setQty(oi.getQty());
                ci.setPrice(oi.getPrice());
                cartItems.add(ci);
            }
            cartRepository.saveCart(userId, cartItems);
        }
        return cartService.getCart(userId);
    }
}
