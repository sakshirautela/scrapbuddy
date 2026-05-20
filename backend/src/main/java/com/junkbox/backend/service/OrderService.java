package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.OrderAssignmentRequest;
import com.junkbox.backend.dto.request.OrderDeliveryRequest;
import com.junkbox.backend.dto.request.OrderRequest;
import com.junkbox.backend.dto.request.OrderRescheduleRequest;
import com.junkbox.backend.dto.response.OrderResponse;
import com.junkbox.backend.entity.Address;
import com.junkbox.backend.entity.Orders;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.AddressRepo;
import com.junkbox.backend.repository.OrdersRepo;
import com.junkbox.backend.repository.UserRepository;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Long GUEST_USER_ID = 0L;

    private final OrdersRepo ordersRepo;
    private final AddressRepo addressRepo;
    private final UserRepository userRepository;
    private final PhoneOtpService phoneOtpService;
    private final JavaMailSender mailSender;

    public OrderService(
            OrdersRepo ordersRepo,
            AddressRepo addressRepo,
            UserRepository userRepository,
            PhoneOtpService phoneOtpService,
            JavaMailSender mailSender) {
        this.ordersRepo = ordersRepo;
        this.addressRepo = addressRepo;
        this.userRepository = userRepository;
        this.phoneOtpService = phoneOtpService;
        this.mailSender = mailSender;
    }

    // CREATE ORDER
    public OrderResponse createOrder(OrderRequest request) {

        validateOrderRequest(request);

        Orders order = new Orders();

        mapRequestToEntity(request, order);

        order.setStatus("Created");
        order.setCreatedByUserID(getCurrentUserId());
        order.setCreatedDateTime(LocalDateTime.now());

        Address orderAddress = request.getAddress();
        User currentUser = getCurrentUserOrNull();

        if (currentUser != null) {
            orderAddress.setUser(currentUser);
        }

        Address savedAddress = addressRepo.save(orderAddress);
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

        order.setStatus(request.getStatus());
        order.setUpdatedDateTime(LocalDateTime.now());

        Orders updatedOrder = ordersRepo.save(order);

        return mapToResponse(updatedOrder);
    }

    public void sendDeliveryOtp(Long id) {
        Long adminId = getAuthenticatedUserId();

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        String receiverPhone = getReceiverPhone(order);
        String deliveryOtp = phoneOtpService.createOtpForPhone(receiverPhone);
        sendDeliveryOtpEmail(order, deliveryOtp);

        order.setUpdatedByUserID(adminId);
        order.setStatus("Delivery OTP Sent");
        order.setUpdatedDateTime(LocalDateTime.now());
        ordersRepo.save(order);
    }

    public OrderResponse deliverOrder(Long id, OrderDeliveryRequest request) {
        Long adminId = getAuthenticatedUserId();

        if (request == null || isBlank(request.getOtp())) {
            throw new IllegalArgumentException("Delivery OTP is required");
        }

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        String receiverPhone = getReceiverPhone(order);

        try {
            phoneOtpService.verifyOtp(receiverPhone, request.getOtp().trim());
        } catch (RuntimeException e) {
            throw new IllegalArgumentException(e.getMessage());
        }

        order.setUpdatedByUserID(adminId);
        order.setStatus("Delivered");
        order.setUpdatedDateTime(LocalDateTime.now());

        Orders updatedOrder = ordersRepo.save(order);

        return mapToResponse(updatedOrder);
    }

    public OrderResponse acceptOrder(Long id) {
        Long adminId = getAuthenticatedUserId();

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        if (order.getPickscheduleById() != null) {
            throw new IllegalArgumentException("Order is already assigned");
        }

        order.setPickscheduleById(adminId);
        order.setUpdatedByUserID(adminId);
        order.setStatus("Scheduled");
        order.setUpdatedDateTime(LocalDateTime.now());

        Orders updatedOrder = ordersRepo.save(order);

        return mapToResponse(updatedOrder);
    }

    public OrderResponse assignOrder(Long id, OrderAssignmentRequest request) {
        Long currentAdminId = getAuthenticatedUserId();

        if (request == null || request.getAdminId() == null) {
            throw new IllegalArgumentException("Admin ID is required");
        }

        User assignedAdmin = userRepository.findById(request.getAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + request.getAdminId()));

        if (!isAdminRole(assignedAdmin.getRole())) {
            throw new IllegalArgumentException("Selected user is not an admin");
        }

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        order.setPickscheduleById(assignedAdmin.getId());
        order.setUpdatedByUserID(currentAdminId);
        order.setStatus("scheduled");
        order.setUpdatedDateTime(LocalDateTime.now());

        Orders updatedOrder = ordersRepo.save(order);

        return mapToResponse(updatedOrder);
    }

    public OrderResponse unassignOrder(Long id) {
        Long currentAdminId = getAuthenticatedUserId();

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        order.setPickscheduleById(null);
        order.setUpdatedByUserID(currentAdminId);
        order.setUpdatedDateTime(LocalDateTime.now());
        Orders updatedOrder = ordersRepo.save(order);

        return mapToResponse(updatedOrder);
    }

    public OrderResponse rescheduleOrder(Long id, OrderRescheduleRequest request) {
        validateScheduleRequest(request);

        Long currentUserId = getAuthenticatedUserId();

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        order.setPickupDate(request.getPickupDate());
        order.setStartRange(request.getStartRange());
        order.setEndRange(request.getEndRange());
        order.setUpdatedByUserID(currentUserId);
        order.setStatus("Rescheduled");
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

        validateTimeRange(request.getStartRange(), request.getEndRange());

        if (request.getCategoryID() == null) {
            throw new IllegalArgumentException(
                    "Category ID is required");
        }

        if (request.getSubCategoryID() == null) {
            throw new IllegalArgumentException(
                    "SubCategory ID is required");
        }

        if (request.getAddress() == null) {
            throw new IllegalArgumentException(
                    "Address is required");
        }

        Address address = request.getAddress();

        if (isBlank(address.getReceiverFirstName())
                || isBlank(address.getReceiverLastName())
                || isBlank(address.getReceiverPhone())
                || isBlank(address.getReceiverEmail())
                || isBlank(address.getApartment())
                || isBlank(address.getCity())
                || isBlank(address.getState())
                || isBlank(address.getZip())
                || isBlank(address.getCountry())) {
            throw new IllegalArgumentException(
                    "Complete address details are required");
        }

    }

    private void validateScheduleRequest(OrderRescheduleRequest request) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Reschedule request cannot be null");
        }

        if (request.getPickupDate() == null) {
            throw new IllegalArgumentException(
                    "Pickup date is required");
        }

        validateTimeRange(request.getStartRange(), request.getEndRange());
    }

    private void validateTimeRange(java.sql.Time startRange, java.sql.Time endRange) {
        if (startRange == null || endRange == null) {
            throw new IllegalArgumentException(
                    "Pickup time range is required");
        }

        if (!endRange.toLocalTime().isAfter(startRange.toLocalTime())) {
            throw new IllegalArgumentException(
                    "Pickup end time must be after start time");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String getReceiverPhone(Orders order) {
        if (order.getAddress() == null || isBlank(order.getAddress().getReceiverPhone())) {
            throw new IllegalArgumentException("Receiver phone number is required for delivery OTP");
        }

        return order.getAddress().getReceiverPhone().trim();
    }

    private String getReceiverEmail(Orders order) {
        if (order.getAddress() == null || isBlank(order.getAddress().getReceiverEmail())) {
            throw new IllegalArgumentException("Receiver email is required for delivery OTP");
        }

        return order.getAddress().getReceiverEmail().trim().toLowerCase();
    }

    private void sendDeliveryOtpEmail(Orders order, String otp) {
        String receiverEmail = getReceiverEmail(order);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(receiverEmail);
        message.setSubject("JunkBox Delivery OTP");
        message.setText(
                "Your JunkBox delivery OTP for order #" + order.getId() + " is: " + otp + "\n\n"
                        + "This OTP is valid for 5 minutes. Share it with the pickup admin only after your order is completed."
        );

        mailSender.send(message);
    }

    // MAP REQUEST DTO -> ENTITY
    private void mapRequestToEntity(
            OrderRequest request,
            Orders order) {

        order.setPickupDate(request.getPickupDate());

        order.setStartRange(request.getStartRange());

        order.setEndRange(request.getEndRange());

        order.setCategoryID(request.getCategoryID());

        order.setSubCategoryID(request.getSubCategoryID());
    }

    // MAP ENTITY -> RESPONSE DTO
    private OrderResponse mapToResponse(Orders order) {

        OrderResponse response = new OrderResponse();

        response.setId(order.getId());

        response.setStatus(order.getStatus());

        response.setPickupDate(order.getPickupDate());

        response.setStartRange(order.getStartRange());

        response.setEndRange(order.getEndRange());

        response.setAddress(order.getAddress());

        response.setCreatedByUserID(order.getCreatedByUserID());

        response.setUpdatedByUserID(order.getUpdatedByUserID());

        response.setPickscheduleById(order.getPickscheduleById());

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

        if (authentication == null
                || authentication.getName() == null
                || "anonymousUser".equals(authentication.getName())
                || !authentication.isAuthenticated()) {
            return GUEST_USER_ID;
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseGet(() -> userRepository.findByEmail(authentication.getName()).orElse(null));

        if (user == null) {
            return GUEST_USER_ID;
        }

        return user.getId();
    }

    private User getCurrentUserOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || authentication.getName() == null
                || "anonymousUser".equals(authentication.getName())
                || !authentication.isAuthenticated()) {
            return null;
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseGet(() -> userRepository.findByEmail(authentication.getName()).orElse(null));
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || authentication.getName() == null
                || "anonymousUser".equals(authentication.getName())
                || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("Authenticated admin is required");
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        return user.getId();
    }

    private boolean isAdminRole(String role) {
        if (role == null) {
            return false;
        }

        String normalizedRole = role.trim().toUpperCase();
        return "ADMIN".equals(normalizedRole)
                || "SUPER_ADMIN".equals(normalizedRole)
                || "SUPERADMIN".equals(normalizedRole)
                || "ROLE_ADMIN".equals(normalizedRole)
                || "ROLE_SUPER_ADMIN".equals(normalizedRole)
                || "ROLE_SUPERADMIN".equals(normalizedRole);
    }
}
