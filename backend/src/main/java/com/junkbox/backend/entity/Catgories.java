package com.junkbox.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

@Embeddable
@Setter
@Getter
public class Catgories {
    private HashMap<String, HashMap<String, Long>> productCategories = new HashMap<>();
}