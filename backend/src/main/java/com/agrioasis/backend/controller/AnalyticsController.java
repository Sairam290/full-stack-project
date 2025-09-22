package com.agrioasis.backend.controller;

import com.agrioasis.backend.model.Order;
import com.agrioasis.backend.model.Product;
import com.agrioasis.backend.repository.OrderRepository;
import com.agrioasis.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/farmer/analytics")
@PreAuthorize("hasRole('farmer')")
public class AnalyticsController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/monthly-sales/{farmerId}")
    public List<MonthlySales> getMonthlySales(@PathVariable String farmerId) {
        // Simplified example: aggregate sales by month
        List<Order> orders = orderRepository.findByFarmerId(farmerId);
        Map<String, Double> salesByMonth = orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getCreatedAt().substring(0, 7), // YYYY-MM
                        Collectors.summingDouble(Order::getTotalAmount)
                ));

        return salesByMonth.entrySet().stream()
                .map(entry -> new MonthlySales(entry.getKey().substring(5, 7), entry.getValue()))
                .toList();
    }

    @GetMapping("/category-sales/{farmerId}")
    public List<CategorySales> getCategorySales(@PathVariable String farmerId) {
        List<Product> products = productRepository.findByFarmerId(farmerId);
        Map<String, Integer> categoryCounts = products.stream()
                .collect(Collectors.groupingBy(
                        Product::getCategory,
                        Collectors.summingInt(p -> 1)
                ));

        return categoryCounts.entrySet().stream()
                .map(entry -> new CategorySales(entry.getKey(), entry.getValue()))
                .toList();
    }
}

class MonthlySales {
    private String month;
    private double sales;

    public MonthlySales(String month, double sales) {
        this.month = month;
        this.sales = sales;
    }

    public String getMonth() { return month; }
    public double getSales() { return sales; }
}

class CategorySales {
    private String name;
    private int value;

    public CategorySales(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public String getName() { return name; }
    public int getValue() { return value; }
}