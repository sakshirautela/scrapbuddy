package com.junkbox.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import java.sql.Time;
import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
//    @Column(length = 32)
    //    @GeneratedValue(generator = "uuid2")

//    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    @Column(unique = true)
    @Email(regexp = "[a-z0-9.-%+-]+@[a-z0-9.-]+\\.[a-z]{2,3")
    private String email;
    private String role;
    private String username;
    private String password;
    private String phone;
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean verified = false;
    private String token;
    private String tokenExpiration;
    private  String firstName;
    private String lastName;
    private Date createdDate;
    private Time createdTime;
}
