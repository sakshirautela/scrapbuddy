package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.RegisterRequest;
import com.junkbox.backend.dto.request.UserRequest;
import com.junkbox.backend.dto.response.UserResponse;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.UserRepository;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImp {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final PhoneOtpService phoneOtpService;
    private final VarifcationService varifcationService;

    public void sendLoginOtp(String phone) {
        User user = repo.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with phone: " + phone));
        phoneOtpService.sendOtp(phone);
    }

    public UserResponse loginWithOtp(String phone, String otp) {
        boolean isVerified = phoneOtpService.verifyOtp(phone, otp);
        if (!isVerified) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        User user = repo.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with phone: " + phone));

        return mapToResponse(user);
    }
    // REGISTER USER
    public UserResponse register(RegisterRequest request) {

        validateRegisterRequest(request);
        String email = request.getEmail().trim().toLowerCase();

        if (repo.findByUsername(email).isPresent()) {

            throw new IllegalArgumentException("Username already exists: " + email);
        }

        User user = new User();

        user.setUsername(email);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setEmail(email);

        user.setPhone(request.getPhone());

        user.setFirstName(request.getFirstName());

        user.setLastName(request.getLastName());

        user.setRole("USER");

        if (!varifcationService.isEmailVerified(email)) {
            throw new IllegalArgumentException("Please verify your email before registration");
        }

        user.setVerified(true);

        user.setCreatedDate(new Date());

        User savedUser = repo.save(user);

        return mapToResponse(savedUser);
    }

    // UPDATE USER
    public UserResponse updateDetails(Long id, @Valid UserRequest request) {

        validateUserRequest(request);

        User user = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setFirstName(request.getFirstName());

        user.setLastName(request.getLastName());

        user.setPhone(request.getPhone());

        user.setEmail(request.getEmail());

        User updatedUser = repo.save(user);

        return mapToResponse(updatedUser);
    }

    // GET USER BY ID
    public UserResponse getUserById(Long id) {

        User user = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        return mapToResponse(user);
    }

    // GET USER BY USERNAME
    public UserResponse getUserByUsername(String username) {
        User user = repo.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return mapToResponse(user);
    }

    public List<UserResponse> getAdmins() {
        return repo.findAll()
                .stream()
                .filter(user -> isAdminRole(user.getRole()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // DELETE USER
    public void deleteUser(Long id) {
        User user = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        repo.delete(user);
    }

    // VALIDATE REGISTER REQUEST
    private void validateRegisterRequest(RegisterRequest request) {

        if (request == null) {

            throw new IllegalArgumentException("Registration request cannot be null");
        }


        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {

            throw new IllegalArgumentException("Password cannot be empty");
        }

        if (request.getPassword().length() < 6) {

            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {

            throw new IllegalArgumentException("Email cannot be empty");
        }
    }

    // VALIDATE USER REQUEST
    private void validateUserRequest(UserRequest request) {

        if (request == null) {

            throw new IllegalArgumentException("User request cannot be null");
        }

        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {

            throw new IllegalArgumentException("First name cannot be empty");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {

            throw new IllegalArgumentException("Email cannot be empty");
        }
    }

    // MAP ENTITY -> RESPONSE DTO
    private UserResponse mapToResponse(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());

        response.setUsername(user.getUsername());

        response.setEmail(user.getEmail());

        response.setPhone(user.getPhone());

        response.setFirstName(user.getFirstName());

        response.setLastName(user.getLastName());

        response.setRole(user.getRole());

        response.setVerified(user.isVerified());

        response.setCreatedDate(user.getCreatedDate());

        return response;
    }

    private boolean isAdminRole(String role) {
        if (role == null) {
            return false;
        }

        String normalizedRole = role.trim().toUpperCase();
        return "ADMIN".equals(normalizedRole)
                || "SUPER_ADMIN".equals(normalizedRole)
                || "SUPERADMIN".equals(normalizedRole)
                || "ROLE_ADMIN".equals(normalizedRole)
                || "ROLE_SUPER_ADMIN".equals(normalizedRole)
                || "ROLE_SUPERADMIN".equals(normalizedRole);
    }

}
