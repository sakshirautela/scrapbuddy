package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.CategoryRequest;
import com.junkbox.backend.dto.response.CategoryResponse;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.service.CategoryService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/auth/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService itemService) {
        this.categoryService = itemService;
    }

    // CREATE CATEGORY
    @PostMapping
    public ResponseEntity<?> createItem(@Valid @RequestBody CategoryRequest request) {

        try {

            CategoryResponse response = categoryService.createItemCategory(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create category");
        }
    }

    // GET ALL CATEGORIES
    @GetMapping
    public ResponseEntity<?> getAllItems() {

        try {

            List<CategoryResponse> items = categoryService.getAllItems();

            return ResponseEntity.ok(items);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch categories");
        }
    }

    // GET CATEGORY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {

        try {

            CategoryResponse response = categoryService.getItemById(id);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch category");
        }
    }

    // UPDATE CATEGORY
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {

        try {

            CategoryResponse response = categoryService.updateItem(id, request);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update category");
        }
    }

    // DELETE CATEGORY
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {

        try {

            categoryService.deleteItem(id);

            return ResponseEntity.ok("Category deleted successfully");

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete category");
        }
    }
}