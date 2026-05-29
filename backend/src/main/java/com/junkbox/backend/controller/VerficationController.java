package com.junkbox.backend.controller;

import com.junkbox.backend.service.PhoneOtpService;
import com.junkbox.backend.service.VarifcationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/verification")
@Slf4j
public class VerficationController {
    private final VarifcationService varifcationService;
    private final PhoneOtpService phoneOtpService;

    public VerficationController(VarifcationService varifcationService, PhoneOtpService phoneOtpService) {
        this.varifcationService = varifcationService;
        this.phoneOtpService = phoneOtpService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @RequestParam String email) {

        try {
            String otp=varifcationService.sendOtp(email);
//            return ResponseEntity.ok(Map.of("message", "OTP sent"));
            return ResponseEntity.ok(Map.of("message", otp));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (DataAccessException e) {
            log.error("Failed to store verification OTP for {}", email, e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Failed to create OTP. Please check the database connection."));
        } catch (MailException e) {
            log.error("Failed to send verification OTP email to {}", email, e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "Failed to send OTP email. Please check the mail server configuration."));
        } catch (Exception e) {
            log.error("Unexpected error while sending verification OTP to {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send OTP. Please check the backend logs for details."));
        }
    }

    @PostMapping("/send-phone-otp")
    public ResponseEntity<?> sendPhoneOtp(
            @RequestParam String phone) {

        phoneOtpService.sendOtp(phone);

        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp) {

        boolean verified =
                varifcationService.verifyOtp(email, otp);

        return ResponseEntity.ok(verified);
    }
    @PostMapping("/verify-phone-otp")
    public ResponseEntity<?> verifyPhoneOtp(
            @RequestParam String phone,
            @RequestParam String otp) {

        boolean verified =
                phoneOtpService.verifyOtp(phone, otp);

        return ResponseEntity.ok(verified);
    }
}
