package com.junkbox.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CategoryResponse {

    private Long id;

    private String category;

    private LocalDateTime createdDateTime;

    private LocalDateTime updatedDateTime;

    private Long createdUserID;

    private Long updatedCategoryID;
}