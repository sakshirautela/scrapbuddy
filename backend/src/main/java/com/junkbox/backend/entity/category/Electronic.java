package com.junkbox.backend.entity.category;

import com.junkbox.backend.entity.Item;

import java.time.LocalDate;

public class Electronic extends Item {
    private String modelNumber;
    private String serialNumber;
    private int warrantyInMonths;
    private LocalDate manufacturingDate;
    private String powerConsumption; // e.g.- "220V", "Battery"
    private String condition; // NEW, USED, REFURBISHED
    private boolean isReturnable;
    private boolean isExchangeAvailable;
    private String materialType; // Plastic, Metal, Mixed
    private double weight;
    private String color;
    private String dimensions; // "10x5x3 cm"
    private String connectivity; // WiFi, Bluetooth, Cable,  None
    private boolean isWorking; // Important for junk/scrap system

}