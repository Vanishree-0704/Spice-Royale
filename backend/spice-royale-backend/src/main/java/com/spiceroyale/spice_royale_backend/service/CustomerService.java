
package com.spiceroyale.spice_royale_backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.spiceroyale.spice_royale_backend.entity.Customer;
import com.spiceroyale.spice_royale_backend.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public CustomerService(
            CustomerRepository customerRepository,
            JwtService jwtService) {

        this.customerRepository = customerRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Customer registerCustomer(Customer customer) {

        if (customer.getEmail() == null ||
                customer.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (customer.getPasswordHash() == null ||
                customer.getPasswordHash().length() < 8) {
            throw new RuntimeException(
                "Password must contain at least 8 characters"
            );
        }

        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        customer.setPasswordHash(
            passwordEncoder.encode(customer.getPasswordHash())
        );

        return customerRepository.save(customer);
    }

    public Map<String, Object> loginCustomer(
            String email, String password) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                password, customer.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
            customer.getId(), customer.getEmail()
        );

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("token", token);
        response.put("customerId", customer.getId());
        response.put("fullName", customer.getFullName());
        response.put("email", customer.getEmail());

        return response;
    }
}
