package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.AuthRequest;
import com.junkbox.backend.dto.request.CategoryRequest;
import com.junkbox.backend.dto.request.RegisterRequest;
import com.junkbox.backend.dto.request.UserDetailsRequest;
import com.junkbox.backend.dto.response.CategoryResponse;
import com.junkbox.backend.dto.response.TokenResponse;
import com.junkbox.backend.dto.response.UserDetailsResponse;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.service.UserServiceImp;
import com.junkbox.backend.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth/u")
public class UserController {
private final UserServiceImp userServiceImp;

    public UserController(UserServiceImp userServiceImp, AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserServiceImp userServiceImp1) {
        this.userServiceImp = userServiceImp1;
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserDetails(@PathVariable Long id, @Valid @RequestBody UserDetailsRequest request) {

        try {

            UserDetailsResponse response = userServiceImp.updateDetails(id, request);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update category");
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {

        try {

            UserDetailsResponse response = userServiceImp.getItemById(id);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch category");
        }
    }
    // DELETE CATEGORY
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        try {

            userServiceImp.deleteItem(id);

            return ResponseEntity.ok("Category deleted successfully");

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete category");
        }
    }

}
