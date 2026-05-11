package com.junkbox.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {

    private Long id;

    private String apartment;

    private String city;

    private String state;

    private String zip;

    private String country;

    private String receiverFirstName;

    private String receiverLastName;

    private String receiverPhone;

    private String receiverEmail;

    private String countryCode;
}