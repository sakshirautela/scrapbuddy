package com.junkbox.backend.entity;

import java.time.LocalDateTime;

public abstract class Item {

    protected Long id;
    protected String name;
    protected String description;
    protected double price;
    protected int quantity;

    protected String brand;
    protected LocalDateTime createdAt;
    protected LocalDateTime updatedAt;

}