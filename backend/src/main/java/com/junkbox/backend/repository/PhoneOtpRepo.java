package com.junkbox.backend.repository;

import com.junkbox.backend.entity.PhoneOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PhoneOtpRepo extends JpaRepository<PhoneOtp, Long> {

    Optional<PhoneOtp> findTopByPhoneOrderByIdDesc(String phone);
}