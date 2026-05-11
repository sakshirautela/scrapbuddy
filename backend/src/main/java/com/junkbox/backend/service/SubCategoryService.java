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

    // CREATE
    public SubCategoryResponse createItemSubCategory(SubCategoryRequest request) {

        validateRequestItem(request);
        SubCategories subCategory = new SubCategories();
        subCategory.setSubCategory(request.getSubCategory());
        subCategory.setPrice(request.getPrice());
        subCategory.setCategoryId(request.getCategoryId());
        subCategory.setSubCreatedUserID(request.getUserId());
        subCategory.setUpdatedDateTime(LocalDateTime.now());
        SubCategories savedItem = subCategoryRepo.save(subCategory);

        return mapToResponse(savedItem);
    }

    // DELETE
    public boolean deleteItem(Long itemId) {

        SubCategories item = subCategoryRepo.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));

        subCategoryRepo.delete(item);

        return true;
    }

    // UPDATE
    public SubCategoryResponse updateItem(Long id, SubCategoryRequest request) {

        validateRequestItem(request);

        SubCategories item = subCategoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + id));
         item.setCategoryId(request.getCategoryId());
        item.setSubCategory(request.getSubCategory());
        item.setPrice(request.getPrice());
        item.setCategoryId(request.getCategoryId());
        item.setUpdatedDateTime(LocalDateTime.now());
        item.setUpdatedSubCategoryID(request.getUserId());
        SubCategories updatedItem = subCategoryRepo.save(item);

        return mapToResponse(updatedItem);
    }

    // GET ALL
    public List<SubCategoryResponse> getAllItems() {
        return subCategoryRepo.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // GET BY ID
    public SubCategoryResponse getItemById(Long id) {

        SubCategories item = subCategoryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + id));

        return mapToResponse(item);
    }

    // VALIDATION
    private void validateRequestItem(SubCategoryRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        if (categoriesRepo.findById(request.getCategoryId()).isEmpty()) {
            throw new IllegalArgumentException("Category not found");
        }
        if (request.getSubCategory() == null || request.getSubCategory().trim().isEmpty()) {

            throw new IllegalArgumentException("SubCategory cannot be empty");
        }
    }

    // ENTITY -> RESPONSE DTO
    private SubCategoryResponse mapToResponse(SubCategories item) {

        SubCategoryResponse response = new SubCategoryResponse();

        response.setId(item.getId());
        response.setSubCategory(item.getSubCategory());
        response.setCategoryId(item.getCategoryId());
        response.setPrice(item.getPrice());
        return response;
    }
}