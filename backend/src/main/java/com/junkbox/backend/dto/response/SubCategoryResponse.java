package com.junkbox.backend.dto.response;


import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class SubCategoryResponse {

    private Long id;

    private String subCategory;

    private Long categoryId;

    private String categoryName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
private float price;
    private Long createdUserID;
}