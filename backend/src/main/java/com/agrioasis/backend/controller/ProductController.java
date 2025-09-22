package com.agrioasis.backend.controller;

import com.agrioasis.backend.model.Product;
import com.agrioasis.backend.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        logger.info("Fetching all products");
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        logger.info("Adding new product: {}", product.getName());
        try {
            product.setStatus("pending"); // New products start as pending
            Product savedProduct = productRepository.save(product);
            logger.info("Product added successfully: {}", savedProduct.getId());
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            logger.error("Failed to add product: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        logger.info("Updating product: {}", id);
        return productRepository.findById(id)
                .map(existingProduct -> {
                    product.setId(id);
                    product.setStatus(existingProduct.getStatus()); // Preserve status
                    Product updatedProduct = productRepository.save(product);
                    logger.info("Product updated successfully: {}", id);
                    return ResponseEntity.ok(updatedProduct);
                })
                .orElseGet(() -> {
                    logger.warn("Product not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        logger.info("Deleting product: {}", id);
        return productRepository.findById(id)
                .map(product -> {
                    productRepository.delete(product);
                    logger.info("Product deleted successfully: {}", id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> {
                    logger.warn("Product not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProductStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        logger.info("Updating status for product: {}", id);
        String status = request.get("status");
        if (status == null || !List.of("pending", "approved", "rejected").contains(status)) {
            logger.warn("Invalid status: {}", status);
            return ResponseEntity.badRequest().body(null);
        }

        return productRepository.findById(id)
                .map(product -> {
                    product.setStatus(status);
                    Product updatedProduct = productRepository.save(product);
                    logger.info("Product status updated successfully: {} to {}", id, status);
                    return ResponseEntity.ok(updatedProduct);
                })
                .orElseGet(() -> {
                    logger.warn("Product not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
}
