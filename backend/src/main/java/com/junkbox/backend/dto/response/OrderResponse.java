package com.junkbox.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class OrderResponse {

    private Long id;

    private boolean status;

    private Date pickupDate;

    private Long addressID;

    private Long createdByUserID;

    private Long updatedByUserID;

    private Long categoryID;

    private Long subCategoryID;

    private LocalDateTime createdDateTime;

    private LocalDateTime updatedDateTime;
}