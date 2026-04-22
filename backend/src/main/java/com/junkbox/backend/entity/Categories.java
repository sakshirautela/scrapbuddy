package com.junkbox.backend.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
public enum Categories {
    VEHICLE("Vehicle"),
    ELECTRONIC("Electronic");
    private final String displayName;
    Categories(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}