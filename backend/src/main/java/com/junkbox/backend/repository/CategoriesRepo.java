package com.junkbox.backend.repository;

import com.junkbox.backend.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface CategoriesRepo extends JpaRepository<Categories, Long> {
    List<Categories> findAllByDeletedFalse();
    Optional<Categories> findByIdAndDeletedFalse(Long id);
}
