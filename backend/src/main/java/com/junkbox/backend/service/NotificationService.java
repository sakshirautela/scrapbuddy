package com.junkbox.backend.service;

import com.junkbox.backend.dto.MailBody;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.repository.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationService {

    private  final JavaMailSender mailSender;
    private final UserRepository userRepository;
    public NotificationService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    public boolean sendNewOrderPlacedMail(MailBody mailBody) {

        String recipient = normalizeEmail(mailBody.getTo());
        Optional<User> userOpt = userRepository.findByEmail(recipient)
                .or(() -> userRepository.findByUsername(recipient));
        if (userOpt.isEmpty()) {
            return false;
        }
        SimpleMailMessage message = getMessage(userOpt.get(), mailBody);

        mailSender.send(message);
        return true;
    }

    private static @NonNull SimpleMailMessage getMessage(User user, MailBody mailBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        String subject = isBlank(mailBody.getSubject())
                ? "Your ScrapBuddy pickup request is confirmed"
                : mailBody.getSubject().trim();
        String body = isBlank(mailBody.getBody())
                ? "We have received your pickup request and will keep you updated as it moves forward."
                : mailBody.getBody().trim();

        message.setTo(user.getEmail());
        message.setSubject(subject);

        message.setText(
                "Hi " + getDisplayName(user) + ",\n\n"
                        + body + "\n\n"
                        + "What happens next:\n"
                        + "- Our team will review and assign the pickup.\n"
                        + "- You can track the latest status from your ScrapBuddy dashboard.\n"
                        + "- You will receive a delivery OTP before the pickup is completed.\n\n"
                        + "Thanks for recycling with ScrapBuddy.\n\n"
                        + "ScrapBuddy Team"
        );
        return message;
    }

    private static String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }
        return email.trim().toLowerCase();
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private static String getDisplayName(User user) {
        String fullName = ((user.getFirstName() == null ? "" : user.getFirstName().trim())
                + " "
                + (user.getLastName() == null ? "" : user.getLastName().trim())).trim();

        return fullName.isEmpty() ? "there" : fullName;
    }
}
