package com.junkbox.backend.service;

import com.junkbox.backend.dto.RegisterRequest;
import com.junkbox.backend.entity.PasswordResetToken;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Service
public class UserServiceImp {


    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private PasswordResetService passwordResetService;

    public String register(RegisterRequest request) {
        if (repo.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        if (!passwordResetService.validateToken(request.getOtp())) {
            return "Invalid or expired token";
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        repo.save(user);
        return "User registered successfully";
    }
//    public void createPasswordResetTokenForUser(User user, String token) {
//        PasswordResetToken myToken = new PasswordResetToken(token, user);
//        passwordTokenRepository.save(myToken);
//    }
//    public User findUserByEmail(String userEmail) {
//    }
}