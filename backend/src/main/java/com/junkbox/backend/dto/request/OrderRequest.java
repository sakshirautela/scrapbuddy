package com.junkbox.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.junkbox.backend.entity.Address;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.util.Date;

@Getter
@Setter
public class OrderRequest {
    @NotNull(message = "Pickup date is required")
    private Date pickupDate;

    @JsonFormat(pattern = "HH:mm:ss")
    private Time startRange;

    @JsonFormat(pattern = "HH:mm:ss")
    private Time endRange;
    private Address address;
    private String status;
    private Float estimateWeight;
    @NotNull(message = "Category ID is required")
    private Long categoryID;
    @NotNull(message = "Subcategory ID is required")
    private Long subCategoryID;
}
