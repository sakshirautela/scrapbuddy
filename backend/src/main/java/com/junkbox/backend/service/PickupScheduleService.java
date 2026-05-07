package com.junkbox.backend.service;

import com.junkbox.backend.dto.PickupScheduleRequest;
import com.junkbox.backend.entity.Pickups;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.repository.PickupScheduleRepo;
import com.junkbox.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PickupScheduleService {

    private final PickupScheduleRepo pickupScheduleRepo;

    @Autowired
    private UserRepository userRepository;

    public PickupScheduleService(PickupScheduleRepo pickupScheduleRepo) {
        this.pickupScheduleRepo = pickupScheduleRepo;
    }

    public Long schedulePickup(PickupScheduleRequest pickupScheduleRequest) {
        Pickups pickScheduling = new Pickups();
        pickScheduling.setItemName(pickupScheduleRequest.getItemName());
        pickScheduling.setCategory(pickupScheduleRequest.getCategory());
        pickScheduling.setDate(pickupScheduleRequest.getDate());
        pickScheduling.setQuantity(pickupScheduleRequest.getQuantity());
        pickScheduling.setPhone(String.valueOf(pickupScheduleRequest.getPhone()));
        pickScheduling.setAddress(pickupScheduleRequest.getAddress());
        pickScheduling.setPickupDate(pickupScheduleRequest.getDate());
        pickScheduling.setActive(true);
        // Assuming userId is in request, but it's not. Need to add userId to PickupScheduleRequest
        // For now, assume it's for a user, but since not specified, skip user for now.
        pickupScheduleRepo.save(pickScheduling);
        return pickScheduling.getId();
    }

    public void cancelPickup(Long pickupScheduleId) {
        Optional<Pickups> pickup = pickupScheduleRepo.findById(pickupScheduleId);
        if (pickup.isPresent()) {
            pickup.get().setActive(false);
            pickupScheduleRepo.save(pickup.get());
        }
    }

    public Long updateSchedulePickup(PickupScheduleRequest pickupScheduleRequest) {
        Optional<Pickups> existing = pickupScheduleRepo.findById(pickupScheduleRequest.getId());
        if (existing.isPresent()) {
            Pickups pick = existing.get();
            pick.setItemName(pickupScheduleRequest.getItemName());
            pick.setCategory(pickupScheduleRequest.getCategory());
            pick.setDate(pickupScheduleRequest.getDate());
            pick.setQuantity(pickupScheduleRequest.getQuantity());
            pick.setPhone(String.valueOf(pickupScheduleRequest.getPhone()));
            pick.setAddress(pickupScheduleRequest.getAddress());
            pick.setPickupDate(pickupScheduleRequest.getDate());
            pickupScheduleRepo.save(pick);
            return pick.getId();
        }
        throw new RuntimeException("Pickup not found");
    }

    public Optional<Pickups> getPickupSchedule(Long pickupScheduleId) {
        return pickupScheduleRepo.findById(pickupScheduleId);
    }

    public List<Pickups> getAllPickupSchedules() {
        return pickupScheduleRepo.findAll();
    }
}
