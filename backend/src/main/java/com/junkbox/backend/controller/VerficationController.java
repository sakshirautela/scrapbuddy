package com.junkbox.backend.controller;

import com.junkbox.backend.service.PhoneOtpService;
import com.junkbox.backend.service.VarifcationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/verification")
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

        varifcationService.sendOtp(email);

        return ResponseEntity.ok("OTP sent");
    }

    @PostMapping("/send-phone-otp")
    public ResponseEntity<?> sendPhoneOtp(
            @RequestParam String phone) {

        phoneOtpService.sendOtp(phone);

        return ResponseEntity.ok("OTP sent");
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
