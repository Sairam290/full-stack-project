package com.agrioasis.backend.controller;

import com.agrioasis.backend.model.Order;
import com.agrioasis.backend.model.User;
import com.agrioasis.backend.repository.OrderRepository;
import com.agrioasis.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/register")
    public ResponseEntity<User> registerFarmer(@RequestBody User farmer) {
        farmer.setRole("farmer");
        farmer.setStatus("active");
        farmer.setJoinDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        farmer.setSales(0.0);
        farmer.setProducts(0);
        User savedFarmer = userRepository.save(farmer);
        return ResponseEntity.ok(savedFarmer);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getFarmer(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/analytics/sales/monthly/{farmerId}")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySales(@PathVariable String farmerId) {
        List<Order> orders = orderRepository.findByFarmerId(farmerId);
        Map<Integer, Double> monthlySales = new TreeMap<>();

        // Initialize months (last 12 months)
        LocalDate now = LocalDate.now();
        for (int i = 11; i >= 0; i--) {
            LocalDate date = now.minusMonths(i);
            monthlySales.put(date.getMonthValue(), 0.0);
        }

        // Aggregate sales by month
        for (Order order : orders) {
            try {
                LocalDate orderDate = LocalDate.parse(order.getCreatedAt().substring(0, 10));
                int month = orderDate.getMonthValue();
                monthlySales.merge(month, order.getTotalAmount(), Double::sum);
            } catch (Exception e) {
                // Skip invalid dates
                continue;
            }
        }

        // Format response
        List<Map<String, Object>> result = monthlySales.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("month", LocalDate.of(now.getYear(), entry.getKey(), 1)
                            .getMonth().getDisplayName(TextStyle.SHORT, Locale.US));
                    map.put("sales", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/analytics/sales/product/{farmerId}")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getProductSales(@PathVariable String farmerId) {
        List<Order> orders = orderRepository.findByFarmerId(farmerId);
        Map<String, Double> productSales = new HashMap<>();

        // Aggregate sales by product name
        for (Order order : orders) {
            for (Order.ProductItem product : order.getProducts()) {
                String productName = product.getName();
                productSales.merge(productName, product.getPrice() * product.getQuantity(), Double::sum);
            }
        }

        // Format response
        List<Map<String, Object>> result = productSales.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
