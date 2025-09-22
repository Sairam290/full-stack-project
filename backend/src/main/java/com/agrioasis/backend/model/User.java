 package com.agrioasis.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role; // "user", "farmer", "admin"
    private String status; // "active", "pending", "suspended"
    private String joinDate;
    private double sales;
    private int products;
    private double spent;
    private int orders;
}
