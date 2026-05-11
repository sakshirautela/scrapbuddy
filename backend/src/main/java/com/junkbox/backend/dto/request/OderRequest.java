package com.junkbox.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Time;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OderRequest {
    private boolean status;
    private Long addressID;
    private Long categoryID;
    private Long subCategoryID;
    private Long userID;
    private Date pickupDate;
    private Time pickupTime;
}
