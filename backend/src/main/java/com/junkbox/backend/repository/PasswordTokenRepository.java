package com.junkbox.backend.repository;

import com.junkbox.backend.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByOtp(String token);

    void deleteAllByExpiresAtBefore(LocalDateTime now);
}
