package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.OderRequest;
import com.junkbox.backend.dto.response.OrderResponse;
import com.junkbox.backend.entity.Orders;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.OrdersRepo;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrdersRepo ordersRepo;

    public OrderService(OrdersRepo ordersRepo) {
        this.ordersRepo = ordersRepo;
    }

    // CREATE ORDER
    public OrderResponse createOrder(OderRequest request) {
        validateCreateRequest(request);
        Orders order = new Orders();

        order.setStatus(false);
        order.setCategoryID(request.getCategoryID());
        order.setSubCategoryID(request.getSubCategoryID());
        order.setAddressID(request.getAddressID());
        order.setPickupDate(request.getPickupDate());
        order.setCreatedDateTime(LocalDateTime.now());
        order.setCreatedByUserID(request.getUserID());
        ordersRepo.save(order);
        Orders savedOrder = ordersRepo.save(order);
        return mapToResponse(savedOrder);
    }

    // GET ORDER BY ID
    public OrderResponse getOrderById(Long id) {
        Orders order = ordersRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        return mapToResponse(order);
    }

    // GET ALL ORDERS
    public List<OrderResponse> getAllOrders() {

        return ordersRepo.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // UPDATE ORDER
    public OrderResponse updateOrder(Long id, OderRequest request) {

        Orders order = ordersRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        order.setStatus(request.isStatus());

        order.setPickupDate(request.getPickupDate());

        order.setAddressID(request.getAddressID());
        order.setUpdatedDateTime(LocalDateTime.now());
        order.setCategoryID(request.getCategoryID());
        order.setSubCategoryID(request.getSubCategoryID());
        order.setUpdatedByUserID(request.getUserID());
        Orders updatedOrder = ordersRepo.save(order);

        return mapToResponse(updatedOrder);
    }

    // DELETE ORDER
    public boolean deleteOrder(Long id) {

        Orders order = ordersRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        ordersRepo.delete(order);

        return true;
    }

    // VALIDATION
    private void validateCreateRequest(OderRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        if (request.getPickupDate() == null) {
            throw new IllegalArgumentException("Pickup date is required");
        }

        if (request.getPickupTime() == null) {
            throw new IllegalArgumentException("Pickup time is required");
        }

        if (request.getAddressID() == null) {
            throw new IllegalArgumentException("Address ID is required");
        }
    }

    // ENTITY -> RESPONSE DTO
    private OrderResponse mapToResponse(Orders order) {

        OrderResponse response = new OrderResponse();

        response.setId(order.getId());

        response.setStatus(order.isStatus());

        response.setPickupDate(order.getPickupDate());

        response.setAddressID(order.getAddressID());
        response.setCreatedByUserID(order.getCreatedByUserID());

        response.setCategoryID(order.getCategoryID());
        response.setSubCategoryID(order.getSubCategoryID());

        response.setCreatedDateTime(order.getCreatedDateTime());

        response.setUpdatedDateTime(order.getUpdatedDateTime());
        return response;
    }
}