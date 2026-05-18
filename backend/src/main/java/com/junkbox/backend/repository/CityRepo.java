package com.junkbox.backend.repository;

import com.junkbox.backend.entity.Cities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepo extends JpaRepository<Cities, Long> {
}