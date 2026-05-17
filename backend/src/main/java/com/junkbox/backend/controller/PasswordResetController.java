package com.junkbox.backend.controller;

import com.junkbox.backend.dto.MailBody;
import com.junkbox.backend.dto.request.ResetPasswordRequest;
import com.junkbox.backend.service.PasswordResetService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    // SEND RESET EMAIL / OTP
    @PostMapping("/forgot")
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody MailBody request) {

        passwordResetService.sendPasswordResetMail(request);

        return ResponseEntity.ok(Map.of("message", "If the email is registered, a reset link/OTP has been sent"));
    }

    // VALIDATE RESET TOKEN
    @GetMapping("/validate")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {

        boolean isValid = passwordResetService.validateToken(token);

        if (!isValid) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid or expired token"));
        }

        return ResponseEntity.ok(Map.of("message", "Token is valid"));
    }

    // RESET PASSWORD
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {

        boolean success = passwordResetService.resetPassword(request);

        if (!success) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "OTP/token is invalid or expired"));
        }

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}