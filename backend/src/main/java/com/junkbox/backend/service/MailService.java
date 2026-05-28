package com.junkbox.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async("taskExecutor")
    public void send(SimpleMailMessage message) {
        if (message == null) {
            return;
        }

        try {
            mailSender.send(message);
        } catch (RuntimeException exception) {
            logger.error("Failed to send email to {}", String.join(",", message.getTo() == null ? new String[0] : message.getTo()), exception);
        }
    }
}
