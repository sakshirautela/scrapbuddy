package com.junkbox.backend.service;

import com.junkbox.backend.dto.MailBody;
import com.junkbox.backend.dto.ResetPasswordRequest;
import com.junkbox.backend.entity.PasswordResetToken;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.repository.PasswordTokenRepository;
import com.junkbox.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordTokenRepository resetTokenRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String generateOTP() {
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(secureRandom.nextInt(10));
        }
        return sb.toString();
    }

    public Boolean resetPassword(ResetPasswordRequest request) {
        Optional<PasswordResetToken> tokenOpt = resetTokenRepository.findByOtp(request.getToken());

        if (tokenOpt.isEmpty() || tokenOpt.get().isExpired()) {
            return false;
        }

        PasswordResetToken tokenRecord = tokenOpt.get();
        User user = tokenRecord.getUser();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        resetTokenRepository.delete(tokenRecord);
        return true;
    }

    public boolean sendEmail(MailBody mailBody) {
        Optional<User> userOpt = userRepository.findByEmail(mailBody.getTo());
        if (userOpt.isEmpty()) {
            return false;
        }

        String otp = generateOTP();
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(userOpt.get());
        token.setOtp(otp);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(60));
        resetTokenRepository.save(token);

        if (mailSender == null) {
            return false;
        }

        mailBody.setBody("Your password reset OTP is: " + otp);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.getTo());
        message.setSubject(mailBody.getSubject());
        message.setText(mailBody.getBody());
        mailSender.send(message);
        return true;
    }

    @Scheduled(fixedRate = 3_600_000) // runs every hour
    public void clearExpiredTokens() {
        resetTokenRepository.deleteAllByExpiresAtBefore(LocalDateTime.now());
    }

    public Boolean validateToken(String token) {
        Optional<PasswordResetToken> tokenOpt = resetTokenRepository.findByOtp(token);
        return tokenOpt.isPresent() && !tokenOpt.get().isExpired();
    }
}


