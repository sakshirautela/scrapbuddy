package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.UserRequest;
import com.junkbox.backend.dto.response.UserResponse;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.service.UserServiceImp;
import com.junkbox.backend.util.JwtUtil;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserServiceImp userServiceImp;
    private final JwtUtil jwtUtil;

    public UserController(UserServiceImp userServiceImp, JwtUtil jwtUtil) {
        this.userServiceImp = userServiceImp;
        this.jwtUtil = jwtUtil;
    }

    // UPDATE USER
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserDetails(@PathVariable Long id, @Valid @RequestBody UserRequest request) {

        try {

            UserResponse response = userServiceImp.updateDetails(id, request);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
        }
    }

    // GET USER BY ID
    @GetMapping("/id/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {

        try {

            UserResponse response = userServiceImp.getUserById(id);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch user");
        }
    }

    @GetMapping("/token")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserByToken(@RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.substring(7); // remove "Bearer "
            String username = jwtUtil.extractUsername(token);

            UserResponse response = userServiceImp.getUserByUsername(username);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch user " + e.getMessage());
        }
    }

    @GetMapping("/admins")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> getAdmins() {
        return ResponseEntity.ok(userServiceImp.getAdmins());
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        try {

            userServiceImp.deleteUser(id);

            return ResponseEntity.ok("User deleted successfully");

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user");
        }
    }
}
