package com.junkbox.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Date;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Orders {

//    @Column(length = 32)
    //    @GeneratedValue(generator = "uuid2")
//    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private boolean status;
    private Date pickupDate;
    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;
    private Long createdByUserID;
    private Long updatedByUserID;
    private Long categoryID;
    private Long SubCategoryID;
    private LocalDateTime createdDateTime;
    private LocalDateTime updatedDateTime;
}