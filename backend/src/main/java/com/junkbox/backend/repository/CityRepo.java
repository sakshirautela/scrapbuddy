package com.junkbox.backend.repository;

import com.junkbox.backend.entity.Cities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepo extends JpaRepository<Cities, Long> {
    List<Cities> findAllByDeletedFalse();
    Optional<Cities> findByIdAndDeletedFalse(Long id);
}
