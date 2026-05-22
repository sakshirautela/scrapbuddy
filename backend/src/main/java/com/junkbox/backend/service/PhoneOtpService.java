package com.junkbox.backend.service;

import com.junkbox.backend.entity.PhoneOtp;
import com.junkbox.backend.repository.PhoneOtpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PhoneOtpService {

    @Autowired
    private PhoneOtpRepo otpRepo;

    public String generateOtp() {

        return String.valueOf(
                (int)((Math.random() * 900000) + 100000)
        );
    }

    public void sendOtp(String phone) {
        createOtpForPhone(phone);
    }

    public String createOtpForPhone(String phone) {

        String otp = generateOtp();

        PhoneOtp phoneOtp = new PhoneOtp();

        phoneOtp.setPhone(phone);
        phoneOtp.setOtp(otp);

        phoneOtp.setVerified(false);

        phoneOtp.setExpiryTime(
                LocalDateTime.now().plusMinutes(5));

        otpRepo.save(phoneOtp);

        // SEND SMS API HERE

        System.out.println(
                "JunkBox verification OTP for " + phone + ": " + otp + " (valid for 5 minutes)");

        return otp;
    }
    public boolean verifyOtp(
            String phone,
            String otp) {

        PhoneOtp savedOtp =
                otpRepo.findTopByPhoneOrderByIdDesc(phone)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "OTP not found"));

        if (savedOtp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "OTP expired");
        }

        if (!savedOtp.getOtp().equals(otp)) {

            throw new RuntimeException(
                    "Invalid OTP");
        }

        savedOtp.setVerified(true);

        otpRepo.save(savedOtp);

        return true;
    }
}
