package com.agrioasis.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
@Data
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String category;
    private int quantity;
    private String image;
    private String farmerId;
    private String farmerName;
    private double rating;
    private String createdAt;
    private String status; // "pending", "approved", "rejected"
}
