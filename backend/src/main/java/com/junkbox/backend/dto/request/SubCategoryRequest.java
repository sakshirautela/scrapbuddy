package com.junkbox.backend.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubCategoryRequest {

    @NotBlank(message = "SubCategory name is required")
    private String subCategory;
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    private float price;
    private Long userId;

}