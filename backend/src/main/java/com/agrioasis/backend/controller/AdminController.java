package com.agrioasis.backend.controller;

import com.agrioasis.backend.model.User;
import com.agrioasis.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        logger.info("Fetching all users");
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/farmers")
    public ResponseEntity<List<User>> getFarmers() {
        logger.info("Fetching all farmers");
        List<User> farmers = userRepository.findByRole("farmer");
        return ResponseEntity.ok(farmers);
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable String userId, @RequestBody Map<String, String> request) {
        logger.info("Updating status for user: {}", userId);
        String status = request.get("status");
        if (status == null || !List.of("active", "pending", "suspended").contains(status)) {
            logger.warn("Invalid status: {}", status);
            return ResponseEntity.badRequest().body(null);
        }

        return userRepository.findById(userId)
                .map(user -> {
                    user.setStatus(status);
                    User updatedUser = userRepository.save(user);
                    logger.info("User status updated successfully: {} to {}", userId, status);
                    return ResponseEntity.ok(updatedUser);
                })
                .orElseGet(() -> {
                    logger.warn("User not found: {}", userId);
                    return ResponseEntity.notFound().build();
                });
    }
}
