package com.agrioasis.backend.config;

import com.agrioasis.backend.model.User;
import com.agrioasis.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed or update admin user
        Optional<User> adminOptional = userRepository.findByEmail("admin@agrioasis.com");
        if (adminOptional.isEmpty()) {
            // Create admin user if it doesn't exist
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@agrioasis.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            admin.setStatus("active");
            admin.setJoinDate("2023-01-15"); // Set joinDate as a string
            admin.setSales(0.0); // Set default sales
            admin.setProducts(0); // Set default products
            userRepository.save(admin);
            System.out.println("Admin user created with joinDate: " + admin.getJoinDate());
        } else {
            // Update admin user if joinDate is null
            User admin = adminOptional.get();
            if (admin.getJoinDate() == null) {
                System.out.println("Admin user exists but joinDate is null. Updating...");
                admin.setJoinDate("2023-01-15");
                User updatedAdmin = userRepository.save(admin);
                System.out.println("Admin user updated with joinDate: " + updatedAdmin.getJoinDate());
            } else {
                System.out.println("Admin user already exists with joinDate: " + admin.getJoinDate());
            }
        }

        // Seed or update farmer user
        Optional<User> farmerOptional = userRepository.findByEmail("john@farm.com");
        if (farmerOptional.isEmpty()) {
            User farmer = new User();
            farmer.setName("John Farmer");
            farmer.setEmail("john@farm.com");
            farmer.setPassword(passwordEncoder.encode("farmer123"));
            farmer.setRole("farmer");
            farmer.setStatus("active");
            farmer.setJoinDate("2023-01-15");
            farmer.setSales(2099.5);
            farmer.setProducts(2);
            userRepository.save(farmer);
            System.out.println("Farmer user created with joinDate: " + farmer.getJoinDate());
        } else {
            System.out.println("Farmer user already exists with joinDate: " + farmerOptional.get().getJoinDate());
        }
    }
}