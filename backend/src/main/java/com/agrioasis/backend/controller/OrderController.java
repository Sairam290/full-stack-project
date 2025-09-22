 package com.agrioasis.backend.controller;

import com.agrioasis.backend.model.Order;
import com.agrioasis.backend.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'FARMER', 'ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        logger.info("Fetching all orders");
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/farmer/{farmerId}")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByFarmer(@PathVariable String farmerId) {
        logger.info("Fetching orders for farmer: {}", farmerId);
        List<Order> orders = orderRepository.findByFarmerId(farmerId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userId) {
        logger.info("Fetching orders for user: {}", userId);
        List<Order> orders = orderRepository.findByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        logger.info("Updating status for order: {}", id);
        String status = request.get("status");
        if (status == null || !List.of("pending", "confirmed", "shipped", "delivered", "cancelled").contains(status)) {
            logger.warn("Invalid status: {}", status);
            return ResponseEntity.badRequest().body(null);
        }

        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(status);
                    Order updatedOrder = orderRepository.save(order);
                    logger.info("Order status updated successfully: {} to {}", id, status);
                    return ResponseEntity.ok(updatedOrder);
                })
                .orElseGet(() -> {
                    logger.warn("Order not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
}
