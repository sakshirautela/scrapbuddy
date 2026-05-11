package com.junkbox.backend.repository;

import com.junkbox.backend.entity.SubCategories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubCategoryRepo extends JpaRepository<SubCategories, Long> {
}
