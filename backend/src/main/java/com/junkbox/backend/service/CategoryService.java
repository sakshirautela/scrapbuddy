package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.CategoryRequest;
import com.junkbox.backend.dto.response.CategoryResponse;
import com.junkbox.backend.dto.response.SubCategoryResponse;
import com.junkbox.backend.entity.Categories;
import com.junkbox.backend.entity.SubCategories;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.CategoriesRepo;
import com.junkbox.backend.repository.SubCategoryRepo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoriesRepo categoriesRepo;

    private final SubCategoryService subCategoryService;

    private final SubCategoryRepo subCategoryRepo;

    public CategoryService(CategoriesRepo categoriesRepo, SubCategoryService subCategoryService, SubCategoryRepo subCategoryRepo) {

        this.categoriesRepo = categoriesRepo;
        this.subCategoryService = subCategoryService;
        this.subCategoryRepo = subCategoryRepo;
    }

    // CREATE CATEGORY
    public CategoryResponse createCategory(CategoryRequest request) {

        validateCategoryRequest(request);

        Categories category = new Categories();

        mapRequestToEntity(request, category);

        category.setCreatedDateTime(LocalDateTime.now());

        Categories savedCategory = categoriesRepo.save(category);

        return mapToResponse(savedCategory, null);
    }

    // UPDATE CATEGORY
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {

        validateCategoryRequest(request);

        Categories category = findCategoryById(id);

        mapRequestToEntity(request, category);

        category.setUpdatedDateTime(LocalDateTime.now());

        Categories updatedCategory = categoriesRepo.save(category);

        return mapToResponse(updatedCategory, null);
    }

    // DELETE CATEGORY
    @Transactional
    public void deleteCategory(Long id) {

        Categories category = findCategoryById(id);

        List<SubCategories> subCategories = subCategoryRepo.findAllByCategoryIdAndDeletedFalse(id);
        subCategories.forEach(subCategory -> {
            subCategory.setDeleted(true);
            subCategory.setUpdatedDateTime(LocalDateTime.now());
        });
        subCategoryRepo.saveAll(subCategories);

        category.setDeleted(true);
        category.setUpdatedDateTime(LocalDateTime.now());
        categoriesRepo.save(category);
    }

    // GET ALL CATEGORIES
    public List<CategoryResponse> getAllCategories() {

        return categoriesRepo.findAllByDeletedFalse().stream().map(category -> mapToResponse(category, null)).collect(Collectors.toList());
    }

    // GET CATEGORY BY ID
    public CategoryResponse getCategoryById(Long id) {

        Categories category = findCategoryById(id);

        return mapToResponse(category, null);
    }

    // GET ALL CATEGORIES WITH SUBCATEGORIES
    public List<CategoryResponse> getAllCategoriesWithSubCategories() {

        List<Categories> categories = categoriesRepo.findAllByDeletedFalse();
        return categories.stream()
                .map(category -> {
                    List<SubCategoryResponse> subCategories = subCategoryService.getSubCategoryByCategoryId(category.getId());
                    return mapToResponse(category, subCategories);
                })
                .collect(Collectors.toList());
    }

    // COMMON FIND METHOD
    private Categories findCategoryById(Long id) {

        return categoriesRepo.findByIdAndDeletedFalse(id).orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    // VALIDATION
    private void validateCategoryRequest(CategoryRequest request) {

        if (request == null) {

            throw new IllegalArgumentException("Category request cannot be null");
        }

        if (isBlank(request.getCategory())) {

            throw new IllegalArgumentException("Category name cannot be empty");
        }
    }

    // REUSABLE STRING CHECK
    private boolean isBlank(String value) {

        return value == null || value.trim().isEmpty();
    }

    // DTO -> ENTITY
    private void mapRequestToEntity(CategoryRequest request, Categories category) {

        category.setCategory(request.getCategory());

        category.setCreatedUserID(request.getCreatedUserID());

        category.setUpdatedCategoryID(request.getUpdatedCategoryID());
    }

    // ENTITY -> DTO
    private CategoryResponse mapToResponse(Categories category, List<SubCategoryResponse> subCategories) {

        CategoryResponse response = new CategoryResponse();

        response.setId(category.getId());

        response.setCategory(category.getCategory());

        response.setCreatedDateTime(category.getCreatedDateTime());

        response.setUpdatedDateTime(category.getUpdatedDateTime());

        response.setSubCategories(subCategories);

        return response;
    }
}
