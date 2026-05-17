package com.junkbox.backend.repository;

import com.junkbox.backend.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailOtpRepo extends JpaRepository<EmailOtp, Long> {

    Optional<EmailOtp> findTopByEmailOrderByIdDesc(String email);
}