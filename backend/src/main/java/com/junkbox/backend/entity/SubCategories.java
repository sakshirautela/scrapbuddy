package com.junkbox.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Setter
@Getter
@Entity
public class SubCategories {
//    @Column(length = 32)
    //    @GeneratedValue(generator = "uuid2")
//    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String subCategory;
    private Long categoryId;
    private LocalDateTime createdDateTime;
    private LocalDateTime updatedDateTime;
    private Long subCreatedUserID;
    private float price;
    private Long updatedSubCategoryID;
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean deleted = false;
}
