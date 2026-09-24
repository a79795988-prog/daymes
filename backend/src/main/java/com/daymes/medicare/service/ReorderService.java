package com.daymes.medicare.service;

import com.daymes.medicare.model.ReorderItem;
import com.daymes.medicare.model.Order;
import com.daymes.medicare.model.OrderItem;
import com.daymes.medicare.dto.CabinetReorderRequest;
import com.daymes.medicare.repository.ReorderRepository;
import com.daymes.medicare.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * Service to manage user's medicine cabinet and bulk reordering.
 */
@Service
public class ReorderService {
    private final ReorderRepository reorderRepository;
    private final OrderRepository orderRepository;

    public ReorderService(ReorderRepository reorderRepository, OrderRepository orderRepository) {
        this.reorderRepository = reorderRepository;
        this.orderRepository = orderRepository;
    }

    // Retrieves all reorder items for a specific user
    public List<ReorderItem> getReorderItems(String userId) {
        return reorderRepository.findByUserId(userId);
    }

    // Places a new order containing all the selected reorder items
    public Order bulkReorder(String userId, CabinetReorderRequest req) {
        List<ReorderItem> allItems = reorderRepository.findByUserId(userId);
        List<ReorderItem> selectedItems = new ArrayList<>();
        
        // Find items that the user requested to reorder
        for (ReorderItem item : allItems) {
            if (req.getItemIds().contains(item.getId())) {
                selectedItems.add(item);
            }
        }
        
        if (selectedItems.isEmpty()) {
            throw new RuntimeException("No valid items selected for reorder");
        }

        Order order = new Order();
        Random random = new Random();
        int randomId = 10000 + random.nextInt(90000);
        order.setOrderId("DAY-" + randomId);
        order.setUserId(userId);
        
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        order.setDate(sdf.format(new Date()));
        order.setStatus("Confirmed");
        order.setStatusClass("status-confirmed");
        
        double total = 0;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (ReorderItem ri : selectedItems) {
            OrderItem oi = new OrderItem();
            oi.setName(ri.getName());
            oi.setQty(ri.getDefaultQty());
            oi.setPrice(ri.getPrice());
            orderItems.add(oi);
            total += (ri.getPrice() * ri.getDefaultQty());
        }
        
        order.setItems(orderItems);
        order.setTotal(total);
        // Add a default address/payment since it's a bulk quick reorder
        order.setAddress("Default Address from Profile");
        order.setPaymentMethod("Card on file");
        
        orderRepository.save(userId, order);
        
        return order;
    }

    // Updates the default quantity for a specific reorder item in the cabinet
    public List<ReorderItem> updateItemQty(String userId, String itemId, int qty) {
        List<ReorderItem> items = reorderRepository.findByUserId(userId);
        for (ReorderItem item : items) {
            if (item.getId().equals(itemId)) {
                item.setDefaultQty(qty);
                break;
            }
        }
        reorderRepository.save(userId, items);
        return items;
    }
}
