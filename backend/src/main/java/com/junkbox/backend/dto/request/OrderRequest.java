package com.junkbox.backend.dto.request;

import com.junkbox.backend.entity.Address;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class OrderRequest {
    private boolean status;
    @NotNull(message = "Pickup date is required")
    private Date pickupDate;
    private Address address;
    @NotNull(message = "Category ID is required")
    private Long categoryID;

    @NotNull(message = "Subcategory ID is required")
    private Long subCategoryID;

}