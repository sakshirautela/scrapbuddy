package com.junkbox.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDateTime;
import java.util.Date;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String status;
    private Date pickupDate;
    private Float earnings;
    private Float weight;
    private Float EstimateWeight;
    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;
    private Long createdByUserID;
    private Long updatedByUserID;
    private Float amount;
    private Time startRange;
    private Time endRange;
    private Long categoryID;
    private Long SubCategoryID;
    private Long pickscheduleById;
    private LocalDateTime createdDateTime;
    private LocalDateTime updatedDateTime;
}