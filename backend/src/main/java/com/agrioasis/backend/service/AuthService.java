package com.agrioasis.backend.service;

import com.agrioasis.backend.model.User;
import com.agrioasis.backend.repository.UserRepository;
import com.agrioasis.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User signup(String name, String email, String password, String role) {
        logger.info("Attempting signup for email: {}, role: {}", email, role);

        if (userRepository.findByEmail(email).isPresent()) {
            logger.warn("Email already exists: {}", email);
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role.toLowerCase());
        user.setStatus("active");
        user.setJoinDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        user.setSales(0.0);
        user.setProducts(0);
        user.setSpent(0.0);
        user.setOrders(0);

        User savedUser = userRepository.save(user);
        logger.info("User signed up successfully: {}", email);
        return savedUser;
    }

    public String login(String email, String password, String role) {
        logger.info("Attempting login for email: {}, role: {}", email, role);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found: {}", email);
                    return new RuntimeException("User not found");
                });

        if (!user.getRole().equalsIgnoreCase(role)) {
            logger.warn("Role mismatch for email: {}. Expected: {}, Actual: {}", email, role, user.getRole());
            throw new RuntimeException("Invalid role");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Invalid password for email: {}", email);
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(email, role);
        logger.info("Login successful for email: {}. Generated token: {}", email, token);
        return token;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found: {}", email);
                    return new RuntimeException("User not found");
                });
    }
}
