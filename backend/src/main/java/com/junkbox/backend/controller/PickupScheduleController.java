package com.junkbox.backend.controller;

import com.junkbox.backend.dto.PickupScheduleRequest;
import com.junkbox.backend.entity.Pickups;
import com.junkbox.backend.service.PickupScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
public class PickupScheduleController {
    @Autowired
    private final PickupScheduleService pickupScheduleService;

    public PickupScheduleController(PickupScheduleService pickupScheduleService) {
        this.pickupScheduleService = pickupScheduleService;
    }

    @PostMapping
    public ResponseEntity<String> schedulePickup(@RequestBody PickupScheduleRequest pickupScheduleRequest) {
        long id = pickupScheduleService.schedulePickup(pickupScheduleRequest);
        return ResponseEntity.ok("scheduled:" + id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pickups> getSchedule(@PathVariable Long id) {
        return pickupScheduleService.getPickupSchedule(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelPickup(@PathVariable Long id) {
        pickupScheduleService.cancelPickup(id);
        return ResponseEntity.ok("cancelled");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateSchedulePickup(@PathVariable Long id, @RequestBody PickupScheduleRequest pickupScheduleRequest) {
        pickupScheduleRequest.setId(id);
        long updatedId = pickupScheduleService.updateSchedulePickup(pickupScheduleRequest);
        return ResponseEntity.ok("updated:" + updatedId);
    }

    @GetMapping
    public ResponseEntity<List<Pickups>> getAllSchedulePickups() {
        return ResponseEntity.ok(pickupScheduleService.getAllPickupSchedules());
    }
}
