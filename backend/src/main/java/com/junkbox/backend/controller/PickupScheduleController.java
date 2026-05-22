package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.OrderAssignmentRequest;
import com.junkbox.backend.dto.request.OrderDeliveryRequest;
import com.junkbox.backend.dto.request.OrderRequest;
import com.junkbox.backend.dto.request.OrderRescheduleRequest;
import com.junkbox.backend.dto.response.OrderResponse;
import com.junkbox.backend.service.OrderService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class PickupScheduleController {

    private final OrderService orderService;

    // CREATE ORDER / SCHEDULE PICKUP
    @PostMapping
    public ResponseEntity<?> createOrder(
            @Valid @RequestBody OrderRequest request) {

        try {
            OrderResponse response =
                    orderService.createOrder(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // GET ORDER BY ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id) {

        OrderResponse response =
                orderService.getOrderById(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/track/{id}")
    public ResponseEntity<?> trackOrder(
            @PathVariable Long id,
            @RequestParam String phone) {

        try {
            OrderResponse response = orderService.trackOrder(id, phone);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // UPDATE ORDER
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderRequest request) {

        OrderResponse response =
                orderService.updateOrder(id, request);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> acceptOrder(@PathVariable Long id) {
        try {
            OrderResponse response = orderService.acceptOrder(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> assignOrder(
            @PathVariable Long id,
            @RequestBody OrderAssignmentRequest request) {
        try {
            OrderResponse response = orderService.assignOrder(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/unassign")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> unassignOrder(@PathVariable Long id) {
        try {
            OrderResponse response = orderService.unassignOrder(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/reschedule")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> rescheduleOrder(
            @PathVariable Long id,
            @RequestBody OrderRescheduleRequest request) {
        try {
            OrderResponse response = orderService.rescheduleOrder(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/delivery-otp")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> sendDeliveryOtp(@PathVariable Long id) {
        try {
            orderService.sendDeliveryOtp(id);
            return ResponseEntity.ok("Delivery OTP sent");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/deliver")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> deliverOrder(
            @PathVariable Long id,
            @RequestBody OrderDeliveryRequest request) {
        try {
            OrderResponse response = orderService.deliverOrder(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrderStatus(
            @PathVariable Long id) {

        try {
            OrderResponse response = orderService.deleteOrder(id);
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }

    }

    // CANCEL ORDER
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id) {

        OrderResponse response = orderService.deleteOrder(id);

        return ResponseEntity.ok(response);
    }

    // GET ALL ORDERS
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        List<OrderResponse> orders =
                orderService.getAllOrders();

        return ResponseEntity.ok(orders);
    }
    @GetMapping("/orderByUser/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderResponse>> getAllOrderByUser(@PathVariable Long id) {
        try{
            return ResponseEntity.ok(orderService.getAllOrderByUser(id));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
