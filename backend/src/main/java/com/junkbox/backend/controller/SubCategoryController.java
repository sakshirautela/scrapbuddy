package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.SubCategoryRequest;
import com.junkbox.backend.dto.response.SubCategoryResponse;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.service.SubCategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/auth/api/subcategories")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    public SubCategoryController(SubCategoryService itemService) {
        this.subCategoryService = itemService;
    }

    // CREATE CATEGORY
    @PostMapping
    public ResponseEntity<?> createItem(@Valid @RequestBody SubCategoryRequest request) {

        try {

            SubCategoryResponse response = subCategoryService.createItemSubCategory(request);

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

            List<SubCategoryResponse> items = subCategoryService.getAllItems();

            return ResponseEntity.ok(items);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch categories");
        }
    }

    // GET CATEGORY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {

        try {

            SubCategoryResponse response = subCategoryService.getItemById(id);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch category");
        }
    }

    // UPDATE CATEGORY
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody SubCategoryRequest request) {

        try {

            SubCategoryResponse response = subCategoryService.updateItem(id, request);

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

            subCategoryService.deleteItem(id);

            return ResponseEntity.ok("Category deleted successfully");

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete category");
        }
    }
}