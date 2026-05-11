package com.junkbox.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Time;
import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderResponse {

    private Long id;
    private boolean status;
    private Date pickupDate;
    private Time pickupTime;
    private Long addressID;
    private Long createdByUserID;
    private Long updatedByUserID;
    private Long categoryID;
    private Long subCategoryID;
    private LocalDateTime createdDateTime;
    private LocalDateTime updatedDateTime;
}