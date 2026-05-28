package com.junkbox.backend.service;

import com.junkbox.backend.dto.MailBody;
import com.junkbox.backend.dto.request.ResetPasswordRequest;
import com.junkbox.backend.entity.PasswordResetToken;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.repository.PasswordTokenRepository;
import com.junkbox.backend.repository.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.mail.SimpleMailMessage;
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

    private final MailService mailService;

    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(UserRepository userRepository, PasswordTokenRepository resetTokenRepository, MailService mailService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.mailService = mailService;
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

        Optional<User> userOpt = userRepository.findByUsernameAndDeletedFalse(mailBody.getTo());

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmailAndDeletedFalse(mailBody.getTo());
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

        SimpleMailMessage message = getMessage(userOpt.get(), otp);

        mailService.send(message);
        return true;
    }

    private static @NonNull SimpleMailMessage getMessage(User user, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        String displayName = getDisplayName(user);

        message.setTo(user.getEmail());
        message.setSubject("Reset your Scrapify password");

        message.setText(
                "Hi " + displayName + ",\n\n"
                        + "We received a request to reset your Scrapify account password.\n\n"
                        + "Your password reset OTP is:\n\n"
                        + otp + "\n\n"
                        + "This OTP is valid for 10 minutes.\n"
                        + "Do not share this code with anyone. Scrapify support will never ask for your OTP.\n\n"
                        + "If you did not request a password reset, ignore this email and your password will stay unchanged.\n\n"
                        + "Thanks,\n"
                        + "Scrapify Team"
        );
        return message;
    }

    private static String getDisplayName(User user) {
        String fullName = ((user.getFirstName() == null ? "" : user.getFirstName().trim())
                + " "
                + (user.getLastName() == null ? "" : user.getLastName().trim())).trim();

        return fullName.isEmpty() ? "there" : fullName;
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
