package com.junkbox.backend.dto;

import com.junkbox.backend.entity.Address;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class PickupScheduleRequest {
    private Long id;
    private String itemName;
    private String category;
    private Date date;
    private Integer quantity;
    private Integer phone;
    private Address address;
}