
package com.spiceroyale.spice_royale_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.spiceroyale.spice_royale_backend.entity.Order;
import com.spiceroyale.spice_royale_backend.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public Order getOrderById(String orderNumber) {
        return orderRepository.findById(orderNumber)
                .orElseThrow(() ->
                    new RuntimeException("Order not found: " + orderNumber));
    }

    // Save order using the authenticated customer's ID
    public Order addOrder(Order order, Long customerId) {
        order.setCustomerId(customerId);
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(String orderNumber, String status) {
        Order order = getOrderById(orderNumber);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // Customer can cancel only their own Pending orders
    public Order cancelCustomerOrder(
            String orderNumber, Long customerId) {

        Order order = getOrderById(orderNumber);

        if (!customerId.equals(order.getCustomerId())) {
            throw new RuntimeException("You cannot cancel another customer's order");
        }

        if (!"Pending".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException(
                "Order cannot be cancelled after preparation has started."
            );
        }

        order.setStatus("Cancelled");
        return orderRepository.save(order);
    }

    public void deleteOrder(String orderNumber) {
        orderRepository.deleteById(orderNumber);
    }
}
