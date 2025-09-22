package com.agrioasis.backend.config;

import com.agrioasis.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        logger.info("Processing request for URI: {}", requestURI);

        if (requestURI.startsWith("/api/auth/")) {
            logger.debug("Skipping JWT filter for auth endpoint: {}", requestURI);
            chain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", authorizationHeader);

        String email = null;
        String jwt = null;
        String role = null;

        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwt = authorizationHeader.substring(7);
                logger.debug("Extracted JWT token: {}", jwt);
                email = jwtUtil.extractEmail(jwt);
                role = jwtUtil.extractRole(jwt);
                logger.info("Extracted email: {}, role: {}", email, role);
            } else {
                logger.debug("No valid Authorization header found");
                chain.doFilter(request, response);
                return;
            }

            if (email != null && role != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.debug("Validating token for email: {}", email);
                try {
                    if (jwtUtil.validateToken(jwt, email)) {
                        String authority = "ROLE_" + role.toUpperCase();
                        logger.info("Token validated. Setting authentication for email: {}, authority: {}", email, authority);
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority(authority))
                        );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        logger.info("Authentication set for user: {} with authority: {}", email, authToken.getAuthorities());
                    } else {
                        logger.warn("Token validation failed for email: {}", email);
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                        return;
                    }
                } catch (Exception e) {
                    logger.error("Token validation error for token: {}. Error: {}", jwt, e.getMessage(), e);
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token validation failed: " + e.getMessage());
                    return;
                }
            } else {
                logger.debug("Skipping authentication: email={}, role={}, existing auth={}",
                        email, role, SecurityContextHolder.getContext().getAuthentication());
            }

        } catch (Exception e) {
            logger.error("Failed to process JWT token: {}. Error: {}", jwt, e.getMessage(), e);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed: " + e.getMessage());
            return;
        }

        chain.doFilter(request, response);
    }
}
