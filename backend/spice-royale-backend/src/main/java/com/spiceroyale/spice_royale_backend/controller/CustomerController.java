
package com.spiceroyale.spice_royale_backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spiceroyale.spice_royale_backend.entity.Customer;
import com.spiceroyale.spice_royale_backend.service.CustomerService;

@RestController
@RequestMapping("/api/customers")

public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(
            @RequestBody Customer customer) {

        try {
            Customer savedCustomer =
                    customerService.registerCustomer(customer);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "message", "Registration successful",
                    "id", savedCustomer.getId(),
                    "fullName", savedCustomer.getFullName(),
                    "email", savedCustomer.getEmail()
                )
            );

        } catch (RuntimeException exception) {
            return ResponseEntity.badRequest().body(
                Map.of("message", exception.getMessage())
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(
            @RequestBody Map<String, String> request) {

        try {
            Map<String, Object> response =
                    customerService.loginCustomer(
                        request.get("email"),
                        request.get("password")
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("message", exception.getMessage())
            );
        }
    }
}
