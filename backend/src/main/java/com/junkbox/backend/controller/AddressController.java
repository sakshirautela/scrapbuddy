package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.AddressRequest;
import com.junkbox.backend.dto.request.CategoryRequest;
import com.junkbox.backend.dto.response.AddressResponse;
import com.junkbox.backend.dto.response.CategoryResponse;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.service.AddressService;
import com.junkbox.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/auth/address")
public class AddressController {

private final AddressService  addressService;
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // CREATE CATEGORY
    @PostMapping
    public ResponseEntity<?> createAddress(@Valid @RequestBody AddressRequest request) {

        try {

            AddressResponse response = addressService.createAddress(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create Address");
        }
    }

    // GET ALL CATEGORIES
    @GetMapping
    public ResponseEntity<?> getAllAddress() {

        try {

            List<AddressResponse> items = addressService.getAllAddress();

            return ResponseEntity.ok(items);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch categories");
        }
    }

    // GET CATEGORY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {

        try {

            AddressResponse response = addressService.getAddressById(id);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch category");
        }
    }

    // UPDATE CATEGORY
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody AddressRequest request) {

        try {

            AddressResponse response = addressService.updateAddress(id, request);

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

            addressService.deleteAddress(id);

            return ResponseEntity.ok("Category deleted successfully");

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete category");
        }
    }
}