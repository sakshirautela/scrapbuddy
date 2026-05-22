package com.junkbox.backend.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    private String role;

    private String username;

    private String password;

    private String phone;

    private String firstName;

    private String lastName;

    private String emailOtp;

    private String phoneOtp;
}
