package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.AddressRequest;
import com.junkbox.backend.dto.response.AddressResponse;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.service.AddressService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // CREATE ADDRESS
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request) {

        AddressResponse response = addressService.createAddress(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL ADDRESSES (ADMIN ONLY)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<AddressResponse>> getAllAddresses() {

        List<AddressResponse> addresses =
                addressService.getAllAddress();

        return ResponseEntity.ok(addresses);
    }

    // GET CURRENT USER ADDRESSES
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AddressResponse>> getMyAddresses() {

        List<AddressResponse> addresses =
                addressService.getCurrentUserAddresses();

        return ResponseEntity.ok(addresses);
    }

    // GET ADDRESS BY ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> getAddressById(
            @PathVariable Long id) {

        AddressResponse response =
                addressService.getAddressById(id);

        return ResponseEntity.ok(response);
    }

    // UPDATE ADDRESS
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {

        AddressResponse response =
                addressService.updateAddress(id, request);

        return ResponseEntity.ok(response);
    }

    // DELETE ADDRESS

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteAddress(
            @PathVariable Long id) {

        addressService.deleteAddress(id);

        return ResponseEntity.ok("Address deleted successfully");
    }
}
