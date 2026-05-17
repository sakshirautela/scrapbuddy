package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.CategoryRequest;
import com.junkbox.backend.dto.response.CategoryResponse;
import com.junkbox.backend.dto.response.CategoryWithSubCategoryResponse;
import com.junkbox.backend.entity.Categories;
import com.junkbox.backend.entity.SubCategories;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.CategoriesRepo;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoriesRepo categoriesRepo;

    private final SubCategoryService subCategoryService;

    public CategoryService(CategoriesRepo categoriesRepo, SubCategoryService subCategoryService) {

        this.categoriesRepo = categoriesRepo;
        this.subCategoryService = subCategoryService;
    }

    // CREATE CATEGORY
    public CategoryResponse createCategory(CategoryRequest request) {

        validateCategoryRequest(request);

        Categories category = new Categories();

        mapRequestToEntity(request, category);

        category.setCreatedDateTime(LocalDateTime.now());

        Categories savedCategory = categoriesRepo.save(category);

        return mapToResponse(savedCategory);
    }

    // UPDATE CATEGORY
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {

        validateCategoryRequest(request);

        Categories category = findCategoryById(id);

        mapRequestToEntity(request, category);

        category.setUpdatedDateTime(LocalDateTime.now());

        Categories updatedCategory = categoriesRepo.save(category);

        return mapToResponse(updatedCategory);
    }

    // DELETE CATEGORY
    public void deleteCategory(Long id) {

        Categories category = findCategoryById(id);

        categoriesRepo.delete(category);
    }

    // GET ALL CATEGORIES
    public List<CategoryResponse> getAllCategories() {

        return categoriesRepo.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // GET CATEGORY BY ID
    public CategoryResponse getCategoryById(Long id) {

        Categories category = findCategoryById(id);

        return mapToResponse(category);
    }

    // GET ALL CATEGORIES WITH SUBCATEGORIES
    public CategoryWithSubCategoryResponse getAllCategoriesWithSubCategories() {

        List<Categories> categories = categoriesRepo.findAll();
        HashMap<Categories, List<SubCategories>> categoriesListHashMap = new HashMap<>();
        for (Categories category : categories) {
            List<SubCategories>subCategories=subCategoryService.getSubCategoryByCategoryId(category.getId());
            categoriesListHashMap.put(category,subCategories);
        }
        CategoryWithSubCategoryResponse categoriesWithSubCategoryResponse = new CategoryWithSubCategoryResponse();
        categoriesWithSubCategoryResponse.setSubCategories(categoriesListHashMap);
        return  categoriesWithSubCategoryResponse;
    }

    // COMMON FIND METHOD
    private Categories findCategoryById(Long id) {

        return categoriesRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
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
    private CategoryResponse mapToResponse(Categories category) {

        CategoryResponse response = new CategoryResponse();

        response.setId(category.getId());

        response.setCategory(category.getCategory());

        response.setCreatedDateTime(category.getCreatedDateTime());

        response.setUpdatedDateTime(category.getUpdatedDateTime());

        return response;
    }
}