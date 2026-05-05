package com.junkbox.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Column(nullable = false, unique = true)
    private String otp;

    private LocalDateTime expiresAt;

    public boolean isExpired() {
        return expiresAt == null || expiresAt.isBefore(LocalDateTime.now());
    }
}
