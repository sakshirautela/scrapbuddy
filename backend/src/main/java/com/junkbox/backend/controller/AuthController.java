package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.AuthRequest;
import com.junkbox.backend.dto.request.RegisterRequest;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.service.UserServiceImp;
import com.junkbox.backend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserServiceImp userService;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        return jwtUtil.generateToken(request.getUsername());
    }

    @PostMapping("/signup")
    public User signup(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }
}