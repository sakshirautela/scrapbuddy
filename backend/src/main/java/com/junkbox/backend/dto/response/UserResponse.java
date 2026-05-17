package com.junkbox.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.util.Date;

@Getter
@Setter
public class UserResponse {

    private Long id;

    private String email;

    private String role;

    private String username;

    private String phone;

    private boolean verified;

    private String tokenExpiration;

    private String firstName;

    private String lastName;

    private Date createdDate;

    private Time createdTime;
}