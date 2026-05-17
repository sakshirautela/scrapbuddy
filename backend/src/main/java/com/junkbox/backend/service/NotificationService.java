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

        Optional<User> userOpt = userRepository.findByUsername(mailBody.getTo());
        if (userOpt.isEmpty()) {
            return false;
        }
        SimpleMailMessage message = getMessage(mailBody, "");

        mailSender.send(message);
        return true;
    }

    private static @NonNull SimpleMailMessage getMessage(MailBody mailBody, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.getTo());
        message.setSubject("Order PlacedMail - JunkBox");

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
}
