package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.SubCategoryRequest;
import com.junkbox.backend.dto.response.SubCategoryResponse;
import com.junkbox.backend.entity.SubCategories;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.CategoriesRepo;
import com.junkbox.backend.repository.SubCategoryRepo;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubCategoryService {

    private final CategoriesRepo categoriesRepo;
    private final SubCategoryRepo subCategoryRepo;

    public SubCategoryService(CategoriesRepo categoriesRepo, SubCategoryRepo subCategoryRepo) {

        this.categoriesRepo = categoriesRepo;
        this.subCategoryRepo = subCategoryRepo;
    }

    // CREATE SUBCATEGORY
    public SubCategoryResponse createSubCategory(SubCategoryRequest request) {

        validateRequest(request);

        SubCategories subCategory = new SubCategories();

        mapRequestToEntity(request, subCategory);

        subCategory.setSubCreatedUserID(request.getUserId());

        subCategory.setCreatedDateTime(LocalDateTime.now());

        SubCategories savedSubCategory = subCategoryRepo.save(subCategory);

        return mapToResponse(savedSubCategory);
    }

    // GET ALL SUBCATEGORIES
    public List<SubCategoryResponse> getAllSubCategories() {

        return subCategoryRepo.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // GET SUBCATEGORY BY ID
    public SubCategoryResponse getSubCategoryById(Long id) {

        SubCategories subCategory = subCategoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("SubCategory not found with ID: " + id));

        return mapToResponse(subCategory);
    }

    // GET SUBCATEGORIES BY CATEGORY ID
    public List<SubCategories> getSubCategoryByCategoryId(Long categoryId) {

        return subCategoryRepo.findAllByCategoryId(categoryId);
    }

    // UPDATE SUBCATEGORY
    public SubCategoryResponse updateSubCategory(Long id, SubCategoryRequest request) {

        validateRequest(request);

        SubCategories subCategory = subCategoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("SubCategory not found with ID: " + id));

        mapRequestToEntity(request, subCategory);

        subCategory.setUpdatedSubCategoryID(request.getUserId());

        subCategory.setUpdatedDateTime(LocalDateTime.now());

        SubCategories updatedSubCategory = subCategoryRepo.save(subCategory);

        return mapToResponse(updatedSubCategory);
    }

    // DELETE SUBCATEGORY
    public void deleteSubCategory(Long id) {

        SubCategories subCategory = subCategoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("SubCategory not found with ID: " + id));

        subCategoryRepo.delete(subCategory);
    }

    // VALIDATION
    private void validateRequest(SubCategoryRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("SubCategory request cannot be null");
        }

        if (request.getCategoryId() == null) {
            throw new IllegalArgumentException("Category ID is required");
        }

        if (categoriesRepo.findById(request.getCategoryId()).isEmpty()) {
            throw new IllegalArgumentException("Category not found with ID: " + request.getCategoryId());
        }

        if (request.getSubCategory() == null || request.getSubCategory().trim().isEmpty()) {

            throw new IllegalArgumentException("SubCategory name cannot be empty");
        }

        if ( request.getPrice() <= 0) {

            throw new IllegalArgumentException("Price must be greater than 0");
        }
    }

    // MAP REQUEST DTO -> ENTITY
    private void mapRequestToEntity(SubCategoryRequest request, SubCategories subCategory) {

        subCategory.setSubCategory(request.getSubCategory());

        subCategory.setCategoryId(request.getCategoryId());

        subCategory.setPrice(request.getPrice());
    }

    // MAP ENTITY -> RESPONSE DTO
    private SubCategoryResponse mapToResponse(SubCategories subCategory) {

        SubCategoryResponse response = new SubCategoryResponse();

        response.setId(subCategory.getId());

        response.setSubCategory(subCategory.getSubCategory());

        response.setCategoryId(subCategory.getCategoryId());

        response.setPrice(subCategory.getPrice());

        return response;
    }
}