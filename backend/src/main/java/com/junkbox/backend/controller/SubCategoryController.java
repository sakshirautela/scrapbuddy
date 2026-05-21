package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.SubCategoryRequest;
import com.junkbox.backend.dto.response.SubCategoryResponse;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.service.SubCategoryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    public SubCategoryController(SubCategoryService subCategoryService) {
        this.subCategoryService = subCategoryService;
    }

    // CREATE SUBCATEGORY
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SUPERADMIN')")
    public ResponseEntity<?> createSubCategory(@Valid @RequestBody SubCategoryRequest request) {

        try {

            SubCategoryResponse response = subCategoryService.createSubCategory(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create subcategory");
        }
    }

    // GET ALL SUBCATEGORIES
    @GetMapping
    public ResponseEntity<?> getAllSubCategories() {

        try {

            List<SubCategoryResponse> items = subCategoryService.getAllSubCategories();

            return ResponseEntity.ok(items);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch subcategories");
        }
    }

    // GET SUBCATEGORY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubCategoryById(@PathVariable Long id) {

        try {

            SubCategoryResponse response = subCategoryService.getSubCategoryById(id);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch subcategory");
        }
    }

    // GET SUBCATEGORIES BY CATEGORY ID
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getSubCategoriesByCategoryId(@PathVariable Long categoryId) {

        try {

            List<SubCategoryResponse> items = subCategoryService.getSubCategoryByCategoryId(categoryId);

            return ResponseEntity.ok(items);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch subcategories");
        }
    }

    // UPDATE SUBCATEGORY
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SUPERADMIN')")
    public ResponseEntity<?> updateSubCategory(@PathVariable Long id, @Valid @RequestBody SubCategoryRequest request) {

        try {

            SubCategoryResponse response = subCategoryService.updateSubCategory(id, request);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update subcategory");
        }
    }

    // DELETE SUBCATEGORY
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SUPERADMIN')")
    public ResponseEntity<?> deleteSubCategory(@PathVariable Long id) {

        try {

            subCategoryService.deleteSubCategory(id);

            return ResponseEntity.ok("Subcategory deleted successfully");

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete subcategory");
        }
    }
}
