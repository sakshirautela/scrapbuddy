package com.junkbox.backend.dto.response;

import com.junkbox.backend.entity.Categories;
import com.junkbox.backend.entity.SubCategories;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.sql.Time;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Getter
@Setter
public class OrderResponse {

    private Long id;

    private String status;

    private Float estimateWeight;

    private Float weight;

    private Float amount;

    private Date pickupDate;

    private Time startRange;

    private Time endRange;

    private AddressResponse address;

    private Long createdByUserID;

    private String createdByName;

    private String createdByEmail;

    private Long updatedByUserID;

    private Long pickscheduleById;
    private HashMap<Categories, List<SubCategories>> categorySubcategoryPairs;

    private LocalDateTime createdDateTime;

    private LocalDateTime updatedDateTime;

}
