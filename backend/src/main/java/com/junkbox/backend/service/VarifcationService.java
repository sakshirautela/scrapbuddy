package com.junkbox.backend.service;

import com.junkbox.backend.entity.EmailOtp;
import com.junkbox.backend.repository.EmailOtpRepo;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VarifcationService {
    private final JavaMailSender mailSender;
    private final PasswordResetService passwordResetService;
    private final EmailOtpRepo otpRepo;

    public VarifcationService(JavaMailSender mailSender, PasswordResetService passwordResetService, EmailOtpRepo otpRepo) {
        this.mailSender = mailSender;
        this.passwordResetService = passwordResetService;
        this.otpRepo = otpRepo;
    }

    public void sendOtp(String email) {
        String normalizedEmail = normalizeEmail(email);

        String otp = passwordResetService.generateOTP();

        EmailOtp emailOtp = new EmailOtp();

        emailOtp.setEmail(normalizedEmail);
        emailOtp.setOtp(otp);

        emailOtp.setExpiryTime(
                LocalDateTime.now().plusMinutes(5));

        emailOtp.setVerified(false);

        otpRepo.save(emailOtp);

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(normalizedEmail);
        message.setSubject("OTP Verification");
        message.setText("Your OTP is: " + otp);

        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);

        EmailOtp savedOtp = otpRepo
                .findTopByEmailOrderByIdDesc(normalizedEmail)
                .orElseThrow(() ->
                        new RuntimeException("OTP not found"));

        if (savedOtp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException("OTP expired");
        }

        if (!savedOtp.getOtp().equals(otp)) {

            throw new RuntimeException("Invalid OTP");
        }

        savedOtp.setVerified(true);

        otpRepo.save(savedOtp);

        return true;
    }

    public boolean isEmailVerified(String email) {
        return otpRepo
                .findTopByEmailOrderByIdDesc(normalizeEmail(email))
                .map(EmailOtp::isVerified)
                .orElse(false);
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }
        return email.trim().toLowerCase();
    }
}
