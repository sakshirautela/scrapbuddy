package com.junkbox.backend.service;

import com.junkbox.backend.entity.User;
import com.junkbox.backend.repository.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(@NonNull String username) {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(normalizeRole(user.getRole()))
                .build();
    }

    private String normalizeRole(String role) {
        if (role == null || role.trim().isEmpty()) {
            return "USER";
        }

        String normalizedRole = role.trim()
                .toUpperCase()
                .replace("-", "_")
                .replace(" ", "_");

        if ("SUPERADMIN".equals(normalizedRole) || "ROLE_SUPERADMIN".equals(normalizedRole)) {
            return "SUPER_ADMIN";
        }

        return normalizedRole.startsWith("ROLE_")
                ? normalizedRole.substring("ROLE_".length())
                : normalizedRole;
    }
}
