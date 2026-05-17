package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.OrderRequest;
import com.junkbox.backend.dto.response.OrderResponse;
import com.junkbox.backend.entity.Orders;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.OrdersRepo;

import jakarta.persistence.criteria.Order;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrdersRepo ordersRepo;

    public OrderService(OrdersRepo ordersRepo) {
        this.ordersRepo = ordersRepo;
    }

    // CREATE ORDER
    public OrderResponse createOrder(OrderRequest request) {

        validateOrderRequest(request);

        Orders order = new Orders();

        mapRequestToEntity(request, order);

        order.setStatus(false);
        order.setCreatedDateTime(LocalDateTime.now());
        order.setCreatedByUserID(request.getUserID());

        Orders savedOrder = ordersRepo.save(order);

        return mapToResponse(savedOrder);
    }

    // GET ORDER BY ID
    public OrderResponse getOrderById(Long id) {

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        return mapToResponse(order);
    }

    // GET ALL ORDERS
    public List<OrderResponse> getAllOrders() {

        return ordersRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // UPDATE ORDER
    public OrderResponse updateOrder(Long id, OrderRequest request) {

        validateOrderRequest(request);

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        mapRequestToEntity(request, order);

        order.setStatus(request.isStatus());
        order.setUpdatedByUserID(request.getUserID());
        order.setUpdatedDateTime(LocalDateTime.now());

        Orders updatedOrder = ordersRepo.save(order);

        return mapToResponse(updatedOrder);
    }

    // DELETE ORDER
    public void deleteOrder(Long id) {

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        ordersRepo.delete(order);
    }

    // VALIDATION
    private void validateOrderRequest(OrderRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Order request cannot be null");
        }

        if (request.getPickupDate() == null) {
            throw new IllegalArgumentException(
                    "Pickup date is required");
        }

        if (request.getAddressID() == null) {
            throw new IllegalArgumentException(
                    "Address ID is required");
        }

        if (request.getCategoryID() == null) {
            throw new IllegalArgumentException(
                    "Category ID is required");
        }

        if (request.getSubCategoryID() == null) {
            throw new IllegalArgumentException(
                    "SubCategory ID is required");
        }

        if (request.getUserID() == null) {
            throw new IllegalArgumentException(
                    "User ID is required");
        }
    }

    // MAP REQUEST DTO -> ENTITY
    private void mapRequestToEntity(
            OrderRequest request,
            Orders order) {

        order.setPickupDate(request.getPickupDate());

        order.setAddressID(request.getAddressID());

        order.setCategoryID(request.getCategoryID());

        order.setSubCategoryID(request.getSubCategoryID());
    }

    // MAP ENTITY -> RESPONSE DTO
    private OrderResponse mapToResponse(Orders order) {

        OrderResponse response = new OrderResponse();

        response.setId(order.getId());

        response.setStatus(order.isStatus());

        response.setPickupDate(order.getPickupDate());

        response.setAddressID(order.getAddressID());

        response.setCreatedByUserID(order.getCreatedByUserID());

        response.setUpdatedByUserID(order.getUpdatedByUserID());

        response.setCategoryID(order.getCategoryID());

        response.setSubCategoryID(order.getSubCategoryID());

        response.setCreatedDateTime(order.getCreatedDateTime());

        response.setUpdatedDateTime(order.getUpdatedDateTime());

        return response;
    }

    public List<OrderResponse> getAllOrderByUser(Long id) {
        List<Orders> orders = ordersRepo.findALlByCreatedByUserID(id);
        List<OrderResponse> orderResponses = new ArrayList<>();
        for (Orders order : orders) {
            orderResponses.add(mapToResponse(order));
        }
        return orderResponses;
    }
}