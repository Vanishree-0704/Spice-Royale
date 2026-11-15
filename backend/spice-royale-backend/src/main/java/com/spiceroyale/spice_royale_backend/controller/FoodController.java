
package com.spiceroyale.spice_royale_backend.controller;

import java.util.List;

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

import com.spiceroyale.spice_royale_backend.entity.Food;
import com.spiceroyale.spice_royale_backend.service.FoodService;
import com.spiceroyale.spice_royale_backend.service.JwtService;

@RestController
@RequestMapping("/api/foods")

public class FoodController {

    private final FoodService foodService;
    private final JwtService jwtService;

    public FoodController(
            FoodService foodService,
            JwtService jwtService) {
        this.foodService = foodService;
        this.jwtService = jwtService;
    }

    // Public API - Customers can view all foods
    @GetMapping
    public List<Food> getAllFoods() {
        return foodService.getAllFoods();
    }

    // Public API - Customers can view food details
    @GetMapping("/{id}")
    public Food getFoodById(@PathVariable Long id) {
        return foodService.getFoodById(id);
    }

    // Admin only - Add food
    @PostMapping
    public Food addFood(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Food food) {

        requireAdmin(authorization);
        return foodService.addFood(food);
    }

    // Admin only - Bulk add foods
    @PostMapping("/bulk")
    public List<Food> addFoods(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody List<Food> foods) {

        requireAdmin(authorization);
        return foodService.addFoods(foods);
    }

    // Admin only - Update food
    @PutMapping("/{id}")
    public Food updateFood(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Food food) {

        requireAdmin(authorization);
        return foodService.updateFood(id, food);
    }

    // Admin only - Delete food
    @DeleteMapping("/{id}")
    public String deleteFood(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        requireAdmin(authorization);
        foodService.deleteFood(id);
        return "Food deleted successfully";
    }

    private void requireAdmin(String authorization) {

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Admin login required");
        }

        String token = authorization.substring(7);

        try {
            String role = jwtService.extractRole(token);

            if (!"ADMIN".equals(role)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Admin access only");
            }

        } catch (ResponseStatusException exception) {
            throw exception;

        } catch (Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or expired token");
        }
    }
}
