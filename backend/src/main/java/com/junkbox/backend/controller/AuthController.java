package com.junkbox.backend.controller;

import com.junkbox.backend.dto.AuthRequest;
import com.junkbox.backend.dto.MailBody;
import com.junkbox.backend.dto.RegisterRequest;
import com.junkbox.backend.service.PasswordResetService;
import com.junkbox.backend.service.UserServiceImp;
import com.junkbox.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Autowired
    private PasswordResetService passwordResetService;

    @GetMapping("/login")
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
    public String signup(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/signup-varify")
    public String generateOtp(MailBody request) {
        return passwordResetService.generateOTP();
    }
}