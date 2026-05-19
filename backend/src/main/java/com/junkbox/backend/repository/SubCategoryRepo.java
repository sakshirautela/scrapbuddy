package com.junkbox.backend.repository;

import com.junkbox.backend.entity.SubCategories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface SubCategoryRepo extends JpaRepository<SubCategories, Long> {
    List<SubCategories> findAllByCategoryId(Long id);

    void deleteAllByCategoryId(Long id);
}
