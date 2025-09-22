package com.agrioasis.backend.controller;

import com.agrioasis.backend.model.User;
import com.agrioasis.backend.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(
            @RequestBody Map<String, String> request) {
        try {
            logger.info("Signup request received for email: {}", request.get("email"));
            User user = authService.signup(
                    request.get("name"),
                    request.get("email"),
                    request.get("password"),
                    request.get("role")
            );
            String token = authService.login(
                    request.get("email"),
                    request.get("password"),
                    request.get("role")
            );
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);
            logger.info("Signup successful for email: {}", request.get("email"));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Signup failed for email: {}. Error: {}", request.get("email"), e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> request) {
        try {
            logger.info("Login request received for email: {}", request.get("email"));
            String token = authService.login(
                    request.get("email"),
                    request.get("password"),
                    request.get("role")
            );
            User user = authService.getUserByEmail(request.get("email"));
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);
            logger.info("Login successful for email: {}", request.get("email"));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for email: {}. Error: {}", request.get("email"), e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}
