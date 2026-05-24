package com.junkbox.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HomeController {
    @GetMapping
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to ScrapBuddy Backend API");
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "API is running");
        response.put("version", "1.0");

        return ResponseEntity.ok(response);
    }

    @GetMapping("health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "ScrapBuddy Backend");
        return ResponseEntity.ok(response);
    }
}