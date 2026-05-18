package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.CategoryRequest;
import com.junkbox.backend.dto.response.CategoryResponse;
import com.junkbox.backend.service.CategoryService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // CREATE CATEGORY
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request) {

        CategoryResponse response =
                categoryService.createCategory(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL CATEGORIES
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories =
                categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/with-subcategories")
    public ResponseEntity<List<CategoryResponse>> getAllCategoriesWithSubCategories() {
        List<CategoryResponse> categories =
                categoryService.getAllCategoriesWithSubCategories();
        return ResponseEntity.ok(categories);
    }
    // GET CATEGORY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @PathVariable Long id) {
        CategoryResponse response =
                categoryService.getCategoryById(id);
        return ResponseEntity.ok(response);
    }

    // UPDATE CATEGORY
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response =
                categoryService.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }

    // DELETE CATEGORY
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully");
    }
}