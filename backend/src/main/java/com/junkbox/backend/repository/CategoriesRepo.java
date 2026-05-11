package com.junkbox.backend.repository;

import com.junkbox.backend.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoriesRepo extends JpaRepository<Categories, Long> {
}
