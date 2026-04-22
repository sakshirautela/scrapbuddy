package com.junkbox.backend.controller;

import com.junkbox.backend.entity.User;
import com.junkbox.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

public class SignUpController {
    @Autowired
    private PasswordEncoder passwordEncoder;
    UserRepository userRespository;

    public void createUser(String username, String rawPassword, String role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        userRespository.save(user);
    }
}
