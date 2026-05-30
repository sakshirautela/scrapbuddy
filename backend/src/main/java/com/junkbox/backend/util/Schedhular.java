package com.junkbox.backend.util;

import com.junkbox.backend.repository.PasswordTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;

public class Schedhular {
    PasswordTokenRepository resetTokenRepository;

    @Scheduled(fixedRate = 3_600_000)
    public void clearExpiredTokens() {
        resetTokenRepository.deleteAllByExpiresAtBefore(LocalDateTime.now());
    }

}
