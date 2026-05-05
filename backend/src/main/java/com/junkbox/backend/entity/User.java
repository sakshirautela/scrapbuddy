package com.junkbox.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;

import javax.validation.constraints.Email;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(unique = true)
    private String username;
    @Email(regexp = "[a-z0-9.-%+-]+@[a-z0-9.-]+\\.[a-z]{2,3")
    private String email;
    private String role;
    private String password;
    private String phone;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private PasswordResetToken passwordResetToken;

    @Embedded
    private Address address;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isverified = false;
}
