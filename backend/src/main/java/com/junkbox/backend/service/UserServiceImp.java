package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.RegisterRequest;
import com.junkbox.backend.dto.request.UserDetailsRequest;
import com.junkbox.backend.dto.response.UserDetailsResponse;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImp(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        validateRegisterRequest(request);

        if (repo.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + request.getUsername());
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        return repo.save(user);
    }

//    public User getUser(UUID id) {
//        if (id == null) {
//            throw new IllegalArgumentException("User ID cannot be null");
//        }
//        return repo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
//    }
//
    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Registration request cannot be null");
        }
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
    }

    public UserDetailsResponse updateDetails(Long id, @Valid UserDetailsRequest request) {
        validateRequestItem(request);

        User u = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Item not found with ID: " + id));
        User updateduser = repo.save(u);

        return mapToResponse(updateduser);
    }

    public UserDetailsResponse getItemById(Long id) {
        User u = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Item not found with ID: " + id));

        return mapToResponse(u);
    }

    public boolean deleteItem(Long itemId) {

        User u = repo.findById(itemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Item not found with ID: " + itemId));

        repo.delete(u);

        return true;
    }
    private void validateRequestItem(UserDetailsRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Request cannot be null");
        }
    }

    // ENTITY -> RESPONSE DTO
    private UserDetailsResponse mapToResponse(User u) {

        UserDetailsResponse response = new UserDetailsResponse();

//        response.setId(u.getId());
//        response.setCategory(u.getFirstName());
        return response;
    }}