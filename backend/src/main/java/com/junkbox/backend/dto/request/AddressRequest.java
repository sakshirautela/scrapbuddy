package com.junkbox.backend.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {

    private String apartment;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Zip is required")
    private String zip;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Receiver first name is required")
    private String receiverFirstName;

    @NotBlank(message = "Receiver last name is required")
    private String receiverLastName;

    @NotBlank(message = "Receiver phone is required")
    private String receiverPhone;

    @Email(message = "Invalid email format")
    private String receiverEmail;

    private String countryCode;
}