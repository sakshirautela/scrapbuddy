package com.junkbox.backend.dto.response;


import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class CategoryResponse {

    private Long id;

    private String category;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long createdUserID;
}