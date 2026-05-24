package com.junkbox.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Getter
@Setter
public class OrderRequest {
    @NotNull(message = "Pickup date is required")
    private Date pickupDate;

    @JsonFormat(pattern = "HH:mm:ss")
    private Time startRange;

    @JsonFormat(pattern = "HH:mm:ss")
    private Time endRange;
    private AddressRequest address;
    private String status;
    private Float estimateWeight;
    @NotNull(message = "Category ID is required")
    private HashMap<Long,List<Long>> categoryIDsWithSubcatIDs;
}
