package com.spiceroyale.spice_royale_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spiceroyale.spice_royale_backend.entity.Food;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {

}
