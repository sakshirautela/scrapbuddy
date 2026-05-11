package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.OderRequest;
import com.junkbox.backend.dto.response.OrderResponse;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/auth/api/schedule")
public class PickupScheduleController {

    private final OrderService orderService;

    public PickupScheduleController(OrderService orderService) {
        this.orderService = orderService;
    }

    // CREATE ORDER
    @PostMapping("/new")
    public ResponseEntity<?> schedulePickup(@Valid @RequestBody OderRequest request) {

        try {

            OrderResponse response = orderService.createOrder(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to schedule pickup");
        }
    }

    // GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSchedule(@PathVariable Long id) {

        try {

            OrderResponse response = orderService.getOrderById(id);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve schedule");
        }
    }

    // UPDATE ORDER
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedulePickup(@PathVariable Long id, @Valid @RequestBody OderRequest request) {

        try {

            OrderResponse response = orderService.updateOrder(id, request);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update pickup");
        }
    }

    // DELETE ORDER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelPickup(@PathVariable Long id) {

        try {

            orderService.deleteOrder(id);

            return ResponseEntity.ok("Pickup cancelled successfully");

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancel pickup");
        }
    }

    // GET ALL ORDERS
    @GetMapping("/getPickups")
    public ResponseEntity<?> getAllSchedulePickups() {

        try {

            List<OrderResponse> orders = orderService.getAllOrders();

            return ResponseEntity.ok(orders);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch pickups");
        }
    }
}