package com.junkbox.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.util.Date;

@Getter
@Setter
public class OrderRescheduleRequest {

    private Date pickupDate;

    @JsonFormat(pattern = "HH:mm:ss")
    private Time startRange;

    @JsonFormat(pattern = "HH:mm:ss")
    private Time endRange;
}
