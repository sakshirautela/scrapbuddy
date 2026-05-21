package com.junkbox.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDeliveryRequest {

    private String otp;

    private Float amount;
}
