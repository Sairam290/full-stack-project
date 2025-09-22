package com.agrioasis.backend.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours

    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public JwtUtil() {
        logger.info("JwtUtil initialized. SECRET_KEY length: {}, Hash: {}",
                SECRET_KEY != null ? SECRET_KEY.length() : "null",
                hashKey(SECRET_KEY));
    }

    public String generateToken(String email, String role) {
        if (SECRET_KEY == null || SECRET_KEY.length() < 32) {
            logger.error("SECRET_KEY is invalid for HS256. Length: {}, Hash: {}",
                    SECRET_KEY != null ? SECRET_KEY.length() : "null", hashKey(SECRET_KEY));
            throw new IllegalStateException("SECRET_KEY must be at least 32 characters for HS256");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        String token = Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
        logger.info("Generated JWT token for email: {}. Token: {}", email, token);
        return token;
    }

    public String extractEmail(String token) {
        try {
            logger.debug("Extracting email from token. SECRET_KEY Hash: {}", hashKey(SECRET_KEY));
            return getClaims(token).getSubject();
        } catch (Exception e) {
            logger.error("Failed to extract email from token: {}", token, e);
            throw e;
        }
    }

    public String extractRole(String token) {
        try {
            logger.debug("Extracting role from token. SECRET_KEY Hash: {}", hashKey(SECRET_KEY));
            return getClaims(token).get("role", String.class);
        } catch (Exception e) {
            logger.error("Failed to extract role from token: {}", token, e);
            throw e;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            logger.debug("Checking if token is expired. SECRET_KEY Hash: {}", hashKey(SECRET_KEY));
            return getClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            logger.error("Failed to check if token is expired: {}", token, e);
            throw e;
        }
    }

    public boolean validateToken(String token, String email) {
        try {
            logger.debug("Validating token. SECRET_KEY Hash: {}", hashKey(SECRET_KEY));
            final String extractedEmail = extractEmail(token);
            return (extractedEmail.equals(email) && !isTokenExpired(token));
        } catch (Exception e) {
            logger.error("Failed to validate token: {}", token, e);
            throw e;
        }
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (SignatureException e) {
            throw new JwtException("JWT signature does not match: " + e.getMessage(), e);
        } catch (ExpiredJwtException e) {
            throw new JwtException("JWT token is expired: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new JwtException("Failed to parse JWT token: " + e.getMessage(), e);
        }
    }

    private String hashKey(String key) {
        if (key == null) return "null";
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(key.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            logger.error("Failed to hash SECRET_KEY", e);
            return "error";
        }
    }
}