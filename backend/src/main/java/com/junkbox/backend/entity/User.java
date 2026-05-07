package com.junkbox.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

import java.util.List;

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
    @Embedded
    private Address address;
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isverified = false;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pickups> pickups;
    @Embedded
    private Catgories catgories;
}
