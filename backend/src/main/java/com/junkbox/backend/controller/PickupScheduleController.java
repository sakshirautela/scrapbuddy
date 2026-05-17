package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.OrderRequest;
import com.junkbox.backend.dto.response.OrderResponse;
import com.junkbox.backend.service.OrderService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request) {

        OrderResponse response =
                orderService.createOrder(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
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

    // DELETE / CANCEL ORDER
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelOrder(
            @PathVariable Long id) {

        orderService.deleteOrder(id);

        return ResponseEntity.ok("Pickup cancelled successfully");
    }

    // GET ALL ORDERS
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
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