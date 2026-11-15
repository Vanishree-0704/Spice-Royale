
package com.spiceroyale.spice_royale_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.spiceroyale.spice_royale_backend.entity.Food;
import com.spiceroyale.spice_royale_backend.repository.FoodRepository;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public Food getFoodById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found: " + id));
    }

    // Add food with automatic ID
    public Food addFood(Food food) {

        if (food.getId() == null) {
            Long nextId = foodRepository.findAll()
                    .stream()
                    .map(Food::getId)
                    .filter(id -> id != null)
                    .max(Long::compareTo)
                    .orElse(0L) + 1;

            food.setId(nextId);
        }

        return foodRepository.save(food);
    }

    public List<Food> addFoods(List<Food> foods) {
        return foodRepository.saveAll(foods);
    }

    public Food updateFood(Long id, Food updatedFood) {
        Food existingFood = getFoodById(id);

        existingFood.setName(updatedFood.getName());
        existingFood.setCategory(updatedFood.getCategory());
        existingFood.setType(updatedFood.getType());
        existingFood.setPrice(updatedFood.getPrice());
        existingFood.setRating(updatedFood.getRating());
        existingFood.setImage(updatedFood.getImage());
        existingFood.setDescription(updatedFood.getDescription());
        existingFood.setIngredients(updatedFood.getIngredients());
        existingFood.setPopular(updatedFood.getPopular());

        return foodRepository.save(existingFood);
    }

    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }
}
