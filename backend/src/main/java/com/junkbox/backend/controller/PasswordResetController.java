package com.junkbox.backend.controller;

import com.junkbox.backend.dto.MailBody;
import com.junkbox.backend.dto.ResetPasswordRequest;
import com.junkbox.backend.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/pass-reset")
    public ResponseEntity<String> requestReset(@RequestBody MailBody request) {
        if (passwordResetService.sendEmail(request)) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok("If the email is registered, you'll get a reset otp");
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> validateToken(@RequestParam("token") String token) {
        if (!passwordResetService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
        return ResponseEntity.ok("Token is valid");
    }

    @PostMapping("/reset-password/confirm")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (passwordResetService.resetPassword(request)) {
            return ResponseEntity.ok("Password updated");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password reset failed; OTP is invalid or expired");
    }
}
