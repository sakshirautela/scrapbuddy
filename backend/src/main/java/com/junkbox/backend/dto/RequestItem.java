package com.junkbox.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestItem {
    long userId;
    String category;
    String itemName;
    long price;

}
