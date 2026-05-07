package com.junkbox.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    private String apartment;
    private String city;
    private String state;
    private String zip;
    private String country;
    private String countryCode;

}
