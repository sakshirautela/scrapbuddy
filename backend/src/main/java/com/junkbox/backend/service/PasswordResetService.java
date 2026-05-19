package com.junkbox.backend.service;

import com.junkbox.backend.dto.MailBody;
import com.junkbox.backend.dto.request.ResetPasswordRequest;
import com.junkbox.backend.entity.PasswordResetToken;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.repository.PasswordTokenRepository;
import com.junkbox.backend.repository.UserRepository;
import org.jspecify.annotations.NonNull;
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

    private final UserRepository userRepository;

    private final PasswordTokenRepository resetTokenRepository;

    private  final JavaMailSender mailSender;

    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(UserRepository userRepository, PasswordTokenRepository resetTokenRepository, JavaMailSender mailSender, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

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
    public boolean sendPasswordResetMail(MailBody mailBody) {

        Optional<User> userOpt = userRepository.findByUsername(mailBody.getTo());

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(mailBody.getTo());
        }

        if (userOpt.isEmpty()) {
            return false;
        }

        String otp = generateOTP();

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(userOpt.get());
        token.setOtp(otp);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        resetTokenRepository.save(token);

        if (mailSender == null) {
            return false;
        }

        SimpleMailMessage message = getMessage(mailBody, otp);

        mailSender.send(message);
        return true;
    }

    private static @NonNull SimpleMailMessage getMessage(MailBody mailBody, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.getTo());
        message.setSubject("Password Reset OTP - JunkBox");

        message.setText(
                "Hello,\n\n" +
                        "We received a request to reset your JunkBox account password.\n\n" +
                        "Your One-Time Password (OTP) is: " + otp + "\n\n" +
                        "This OTP is valid for 10 minutes.\n" +
                        "Do not share this OTP with anyone for security reasons.\n\n" +
                        "If you did not request a password reset, please ignore this email.\n\n" +
                        "Regards,\n" +
                        "JunkBox Team"
        );
        return message;
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

