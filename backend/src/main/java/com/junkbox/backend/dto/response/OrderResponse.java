package com.junkbox.backend.dto.response;

import com.junkbox.backend.entity.Address;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.sql.Time;
import java.util.Date;

@Getter
@Setter
public class OrderResponse {

    private Long id;

    private String status;

    private Date pickupDate;

    private Time startRange;

    private Time endRange;

    private Address address;

    private Long createdByUserID;

    private Long updatedByUserID;

    private Long pickscheduleById;

    private Long categoryID;

    private Long subCategoryID;

    private LocalDateTime createdDateTime;

    private LocalDateTime updatedDateTime;

}
