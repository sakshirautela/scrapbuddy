package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.CategoryRequest;
import com.junkbox.backend.dto.response.CategoryResponse;
import com.junkbox.backend.entity.Categories;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.CategoriesRepo;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoriesRepo categoriesRepo;
    public CategoryService(CategoriesRepo categoriesRepo) {

        this.categoriesRepo = categoriesRepo;
    }
    public CategoryResponse createItemCategory(CategoryRequest request) {
    validateRequestItem(request);
    Categories categories = new Categories();
    categories.setCategory(request.getCategory());
    categories.setCreatedUserID(request.getCreatedUserID());
    categories.setCreatedDateTime(LocalDateTime.now());
    Categories savedItem = categoriesRepo.save(categories);
    return mapToResponse(savedItem);
}

// DELETE
public boolean deleteItem(Long itemId) {

    Categories item = categoriesRepo.findById(itemId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Item not found with ID: " + itemId));

    categoriesRepo.delete(item);

    return true;
}

// UPDATE
public CategoryResponse updateItem(
        Long id,
        CategoryRequest request) {

    validateRequestItem(request);

    Categories item = categoriesRepo.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Item not found with ID: " + id));
    item.setCategory(request.getCategory());
    item.setUpdatedCategoryID(request.getCreatedUserID());
    item.setUpdatedDateTime(LocalDateTime.now());
    Categories updatedItem = categoriesRepo.save(item);

    return mapToResponse(updatedItem);
}

// GET ALL
public List<CategoryResponse> getAllItems() {
    return categoriesRepo.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

// GET BY ID
public CategoryResponse getItemById(Long id) {

    Categories item = categoriesRepo.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Item not found with ID: " + id));

    return mapToResponse(item);
}

// VALIDATION
private void validateRequestItem(CategoryRequest request) {

    if (request == null) {
        throw new IllegalArgumentException(
                "Request cannot be null");
    }

    if (request.getCategory() == null
            || request.getCategory().trim().isEmpty()) {

        throw new IllegalArgumentException(
                "SubCategory cannot be empty");
    }
}

// ENTITY -> RESPONSE DTO
private CategoryResponse mapToResponse(Categories item) {

    CategoryResponse response = new CategoryResponse();

    response.setId(item.getId());
    response.setCategory(item.getCategory());
    return response;
}}
