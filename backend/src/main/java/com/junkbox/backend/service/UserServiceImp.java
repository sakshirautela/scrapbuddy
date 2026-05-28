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

    public List<UserResponse> getAllUsers() {
        return repo.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse createUserByAdmin(@Valid UserRequest request) {
        validateAdminCreateRequest(request);

        String email = normalizeEmail(request.getEmail());
        String phone = normalizePhone(request.getPhone());
        String role = normalizeAssignableRole(request.getRole());

        repo.findByEmail(email).ifPresent(existingUser -> {
            throw new IllegalArgumentException("Email already exists: " + email);
        });

        repo.findByUsername(email).ifPresent(existingUser -> {
            throw new IllegalArgumentException("Username already exists: " + email);
        });

        if (!phone.isEmpty()) {
            repo.findByPhone(phone).ifPresent(existingUser -> {
                throw new IllegalArgumentException("Phone already exists: " + phone);
            });
        }

        User user = new User();
        user.setUsername(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(email);
        user.setPhone(phone);
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName() == null ? "" : request.getLastName().trim());
        user.setRole(role);
        user.setVerified(true);
        user.setCreatedDate(new Date());

        return mapToResponse(repo.save(user));
    }

    public UserResponse updateUserRole(Long id, String role) {
        User user = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setRole(normalizeAssignableRole(role));

        return mapToResponse(repo.save(user));
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
        String email = normalizeEmail(request.getEmail());
        String phone = normalizePhone(request.getPhone());
        boolean emailChanged = !email.equals(normalizeEmail(user.getEmail()));

        if (emailChanged) {
            if (request.getEmailOtp() == null || request.getEmailOtp().trim().isEmpty()) {
                throw new IllegalArgumentException("Email OTP is required");
            }

            varifcationService.verifyOtp(email, request.getEmailOtp().trim());

            repo.findByEmail(email)
                    .filter(existingUser -> !existingUser.getId().equals(id))
                    .ifPresent(existingUser -> {
                        throw new IllegalArgumentException("Email already exists: " + email);
                    });

            repo.findByUsername(email)
                    .filter(existingUser -> !existingUser.getId().equals(id))
                    .ifPresent(existingUser -> {
                        throw new IllegalArgumentException("Email already exists: " + email);
                    });
        }

        if (!phone.equals(normalizePhone(user.getPhone()))) {
            if (phone.isEmpty()) {
                throw new IllegalArgumentException("Phone cannot be empty");
            }

            if (request.getPhoneOtp() == null || request.getPhoneOtp().trim().isEmpty()) {
                throw new IllegalArgumentException("Phone OTP is required");
            }

            phoneOtpService.verifyOtp(phone, request.getPhoneOtp().trim());

            repo.findByPhone(phone)
                    .filter(existingUser -> !existingUser.getId().equals(id))
                    .ifPresent(existingUser -> {
                        throw new IllegalArgumentException("Phone already exists: " + phone);
                    });
        }

        user.setFirstName(request.getFirstName());

        user.setLastName(request.getLastName());

        user.setPhone(phone);
        user.setUsername(email);
        user.setEmail(email);

        if (!email.equals(normalizeEmail(user.getUsername()))) {
            user.setUsername(email);
        }

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
        User user = repo.findByUsername(username)
                .or(() -> repo.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
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

    private String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }

        return email.trim().toLowerCase();
    }

    private String normalizePhone(String phone) {
        if (phone == null) {
            return "";
        }

        return phone.trim();
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

    private void validateAdminCreateRequest(UserRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("User request cannot be null");
        }

        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name cannot be empty");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        normalizeAssignableRole(request.getRole());
    }

    private String normalizeAssignableRole(String role) {
        if (role == null || role.trim().isEmpty()) {
            return "USER";
        }

        String normalizedRole = role.trim().toUpperCase();

        if ("ROLE_USER".equals(normalizedRole)) {
            return "USER";
        }

        if ("ROLE_ADMIN".equals(normalizedRole)) {
            return "ADMIN";
        }

        if ("SUPERADMIN".equals(normalizedRole) || "ROLE_SUPERADMIN".equals(normalizedRole)
                || "ROLE_SUPER_ADMIN".equals(normalizedRole)) {
            return "SUPER_ADMIN";
        }

        if ("USER".equals(normalizedRole)
                || "ADMIN".equals(normalizedRole)
                || "SUPER_ADMIN".equals(normalizedRole)) {
            return normalizedRole;
        }

        throw new IllegalArgumentException("Role must be USER, ADMIN, or SUPER_ADMIN");
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
