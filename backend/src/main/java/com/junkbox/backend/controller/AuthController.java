package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.AuthRequest;
import com.junkbox.backend.dto.request.RegisterRequest;
import com.junkbox.backend.dto.response.AuthResponse;
import com.junkbox.backend.dto.response.UserResponse;
import com.junkbox.backend.service.UserServiceImp;
import com.junkbox.backend.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final UserServiceImp userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        log.info("Attempting login for user: {}", request.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserResponse user = userService.getUserByUsername(userDetails.getUsername());
            String token = jwtUtil.generateToken(user);
            
            log.info("Login successful for user: {}", userDetails.getUsername());
            return ResponseEntity.ok(createAuthResponse(token, user));

        } catch (BadCredentialsException e) {
            log.warn("Invalid login attempt for user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        } catch (Exception e) {
            log.error("An error occurred during login for user: {}", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An internal error occurred"));
        }
    }

    @PostMapping("/login-otp")
    public ResponseEntity<?> loginWithOtp(@RequestParam String phone, @RequestParam String otp) {
        log.info("Attempting OTP login for phone: {}", phone);
        try {
            UserResponse user = userService.loginWithOtp(phone, otp);
            String token = jwtUtil.generateToken(user);
            
            log.info("OTP login successful for phone: {}", phone);
            return ResponseEntity.ok(createAuthResponse(token, user));
            
        } catch (Exception e) {
            log.warn("OTP login failed for phone: {} - Error: {}", phone, e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid OTP or phone number"));
        }
    }

    @PostMapping("/send-login-otp")
    public ResponseEntity<?> sendLoginOtp(@RequestParam String phone) {
        log.info("Requesting OTP for phone: {}", phone);
        try {
            userService.sendLoginOtp(phone);
            log.info("OTP sent successfully to phone: {}", phone);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + phone));
        } catch (Exception e) {
            log.error("Failed to send OTP to phone: {} - Error: {}", phone, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody RegisterRequest request) {
        log.info("Attempting to register new user with username: {}", request.getUsername());
        UserResponse user = userService.register(request);
        log.info("User successfully registered: {}", user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    private AuthResponse createAuthResponse(String token, UserResponse user) {
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .username(user.getUsername())
                .user(user)
                .build();
    }
}
