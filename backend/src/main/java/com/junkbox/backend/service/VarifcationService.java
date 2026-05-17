package com.junkbox.backend.service;

import com.junkbox.backend.entity.EmailOtp;
import com.junkbox.backend.repository.EmailOtpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;

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

        String otp = passwordResetService.generateOTP() ;

        EmailOtp emailOtp = new EmailOtp();

        emailOtp.setEmail(email);
        emailOtp.setOtp(otp);

        emailOtp.setExpiryTime(
                LocalDateTime.now().plusMinutes(5));

        emailOtp.setVerified(false);

        otpRepo.save(emailOtp);

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("OTP Verification");
        message.setText("Your OTP is: " + otp);

        mailSender.send(message);
    }
    public boolean verifyOtp(String email, String otp) {

        EmailOtp savedOtp = otpRepo
                .findTopByEmailOrderByIdDesc(email)
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
}
