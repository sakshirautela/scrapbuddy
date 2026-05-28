package com.junkbox.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long  id;
    private String apartment;
    @Column(nullable = false)
    private String city;
    private String state;
    private String zip;
    private String country;
    private String receiverFirstName;
    private String receiverLastName;
    private String receiverPhone;
    private String receiverEmail;
    private String countryCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean deleted = false;
}
