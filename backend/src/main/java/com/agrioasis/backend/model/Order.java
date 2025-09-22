package com.agrioasis.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "orders")
@Data
public class Order {
    @Id
    private String id;
    private List<ProductItem> products;
    private double totalAmount;
    private String status; // "pending", "confirmed", "shipped", "delivered", "cancelled"
    private String farmerId;
    private String userId;
    private String userName;
    private String userContact;
    private String shippingAddress;
    private String createdAt;

    @Data
    public static class ProductItem {
        private String productId;
        private String name;
        private int quantity;
        private double price;
    }
}
