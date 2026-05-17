package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.AuthRequest;
import com.junkbox.backend.dto.request.RegisterRequest;
import com.junkbox.backend.dto.response.UserResponse;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.service.UserServiceImp;
import com.junkbox.backend.util.JwtUtil;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserServiceImp userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserResponse user =
                userService.getUserByUsername(request.getUsername());

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "role", user.getRole(),
                        "username", user.getUsername()
                )
        );
    }

    // REGISTER USER
    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(
            @Valid @RequestBody RegisterRequest request) {
        UserResponse user = userService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }
}