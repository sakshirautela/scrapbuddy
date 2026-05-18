package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.OrderRequest;
import com.junkbox.backend.dto.response.OrderResponse;
import com.junkbox.backend.entity.Address;
import com.junkbox.backend.entity.Orders;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.AddressRepo;
import com.junkbox.backend.repository.OrdersRepo;
import com.junkbox.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrdersRepo ordersRepo;
    private final AddressRepo addressRepo;
    private final UserRepository userRepository;

    public OrderService(
            OrdersRepo ordersRepo,
            AddressRepo addressRepo,
            UserRepository userRepository) {
        this.ordersRepo = ordersRepo;
        this.addressRepo = addressRepo;
        this.userRepository = userRepository;
    }

    // CREATE ORDER
    public OrderResponse createOrder(OrderRequest request) {

        validateOrderRequest(request);

        Orders order = new Orders();

        mapRequestToEntity(request, order);

        order.setStatus(false);
        order.setCreatedByUserID(getCurrentUserId());
        order.setCreatedDateTime(LocalDateTime.now());

        Address savedAddress = addressRepo.save(request.getAddress());
        order.setAddress(savedAddress);

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


        if (request.getCategoryID() == null) {
            throw new IllegalArgumentException(
                    "Category ID is required");
        }

        if (request.getSubCategoryID() == null) {
            throw new IllegalArgumentException(
                    "SubCategory ID is required");
        }

    }

    // MAP REQUEST DTO -> ENTITY
    private void mapRequestToEntity(
            OrderRequest request,
            Orders order) {

        order.setPickupDate(request.getPickupDate());


        order.setCategoryID(request.getCategoryID());

        order.setSubCategoryID(request.getSubCategoryID());
    }

    // MAP ENTITY -> RESPONSE DTO
    private OrderResponse mapToResponse(Orders order) {

        OrderResponse response = new OrderResponse();

        response.setId(order.getId());

        response.setStatus(order.isStatus());

        response.setPickupDate(order.getPickupDate());

        response.setAddress(order.getAddress());

        response.setCreatedByUserID(order.getCreatedByUserID());

        response.setUpdatedByUserID(order.getUpdatedByUserID());

        response.setCategoryID(order.getCategoryID());

        response.setSubCategoryID(order.getSubCategoryID());

        response.setCreatedDateTime(order.getCreatedDateTime());

        response.setUpdatedDateTime(order.getUpdatedDateTime());

        return response;
    }

    public List<OrderResponse> getAllOrderByUser(Long id) {
        List<Orders> orders = ordersRepo.findAllByCreatedByUserIDOrderByCreatedDateTimeDesc(id);
        List<OrderResponse> orderResponses = new ArrayList<>();
        for (Orders order : orders) {
            orderResponses.add(mapToResponse(order));
        }
        return orderResponses;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("Authenticated user is required to create order");
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        return user.getId();
    }
}
