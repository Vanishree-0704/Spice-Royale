
package com.spiceroyale.spice_royale_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.spiceroyale.spice_royale_backend.entity.Order;
import com.spiceroyale.spice_royale_backend.service.JwtService;
import com.spiceroyale.spice_royale_backend.service.OrderService;

@RestController
@RequestMapping("/api/orders")

public class OrderController {

    private final OrderService orderService;
    private final JwtService jwtService;

    public OrderController(
            OrderService orderService,
            JwtService jwtService) {
        this.orderService = orderService;
        this.jwtService = jwtService;
    }

    // ADMIN ONLY: Get all customer orders
    @GetMapping
    public List<Order> getAllOrders(
            @RequestHeader("Authorization") String authorization) {

        requireAdmin(authorization);

        return orderService.getAllOrders();
    }

    // CUSTOMER ONLY: Get logged-in customer's orders
    @GetMapping("/my-orders")
    public List<Order> getMyOrders(
            @RequestHeader("Authorization") String authorization) {

        Long customerId = getCustomerIdFromToken(authorization);

        return orderService.getOrdersByCustomerId(customerId);
    }

    // ADMIN ONLY: Get a specific order
    @GetMapping("/{orderNumber}")
    public Order getOrderById(
            @PathVariable String orderNumber,
            @RequestHeader("Authorization") String authorization) {

        requireAdmin(authorization);

        return orderService.getOrderById(orderNumber);
    }

    // CUSTOMER ONLY: Create an order
    @PostMapping
    public Order addOrder(
            @RequestBody Order order,
            @RequestHeader("Authorization") String authorization) {

        Long customerId = getCustomerIdFromToken(authorization);

        return orderService.addOrder(order, customerId);
    }

    // ADMIN ONLY: Update order status
    @PutMapping("/{orderNumber}/status")
    public Order updateOrderStatus(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authorization) {

        requireAdmin(authorization);

        return orderService.updateOrderStatus(
                orderNumber,
                request.get("status")
        );
    }

    // CUSTOMER ONLY: Cancel own Pending order
    @PutMapping("/{orderNumber}/cancel")
    public Order cancelOrder(
            @PathVariable String orderNumber,
            @RequestHeader("Authorization") String authorization) {

        Long customerId = getCustomerIdFromToken(authorization);

        return orderService.cancelCustomerOrder(
                orderNumber, customerId
        );
    }

    // ADMIN ONLY: Delete an order
    @DeleteMapping("/{orderNumber}")
    public String deleteOrder(
            @PathVariable String orderNumber,
            @RequestHeader("Authorization") String authorization) {

        requireAdmin(authorization);

        orderService.deleteOrder(orderNumber);

        return "Order deleted successfully";
    }

    // Extract and validate customer token
    private Long getCustomerIdFromToken(String authorization) {

        try {
            String token = extractToken(authorization);

            String role = jwtService.extractRole(token);

            if (!"CUSTOMER".equals(role)) {
                throw new Exception("Customer access required");
            }

            return jwtService.extractCustomerId(token);

        } catch (Exception exception) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid customer login token"
            );
        }
    }

    // Validate admin role
    private void requireAdmin(String authorization) {

        try {
            String token = extractToken(authorization);

            String role = jwtService.extractRole(token);

            if (!"ADMIN".equals(role)) {
                throw new Exception("Admin access required");
            }

        } catch (Exception exception) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Admin access required"
            );
        }
    }

    // Extract Bearer token
    private String extractToken(String authorization) {

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {

            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Authorization token is required"
            );
        }

        return authorization.substring(7);
    }
}
