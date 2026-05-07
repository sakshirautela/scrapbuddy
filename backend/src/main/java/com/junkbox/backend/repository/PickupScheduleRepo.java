package com.junkbox.backend.repository;

import com.junkbox.backend.entity.Pickups;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PickupScheduleRepo extends JpaRepository<Pickups, Long> {
    Optional<Pickups> findByPhone(String phone);
    Optional<Pickups> findByCategory(String category);
    Optional<Pickups> findByAddressCity(String city);
}