package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.*;
import com.junkbox.backend.dto.response.AddressResponse;
import com.junkbox.backend.dto.response.CategoryResponse;
import com.junkbox.backend.dto.response.OrderResponse;
import com.junkbox.backend.dto.response.SubCategoryResponse;
import com.junkbox.backend.entity.*;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.*;

import org.jspecify.annotations.NonNull;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Long GUEST_USER_ID = 0L;
    private static final DateTimeFormatter PICKUP_DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");

    private final OrdersRepo ordersRepo;
    private final AddressRepo addressRepo;
    private final UserRepository userRepository;
    private final PhoneOtpService phoneOtpService;
    private final JavaMailSender mailSender;
    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;

    public OrderService(
            OrdersRepo ordersRepo,
            AddressRepo addressRepo,
            UserRepository userRepository,
            PhoneOtpService phoneOtpService,
            JavaMailSender mailSender,
            CategoryService categoryService,
            SubCategoryService subCategoryService) {
        this.ordersRepo = ordersRepo;
        this.addressRepo = addressRepo;
        this.userRepository = userRepository;
        this.phoneOtpService = phoneOtpService;
        this.mailSender = mailSender;
        this.categoryService = categoryService;
        this.subCategoryService = subCategoryService;
    }

    // CREATE ORDER
    public OrderResponse createOrder(OrderRequest request) {

        validateOrderRequest(request);

        Orders order = new Orders();

        mapRequestToEntity(request, order);

        order.setStatus("Created");
        order.setCreatedByUserID(getCurrentUserId());
        order.setCreatedDateTime(LocalDateTime.now());

        Address orderAddress = resolveOrderAddress(request.getAddress());

        order.setAddress(orderAddress);

        Orders savedOrder = ordersRepo.save(order);
        sendOrderLifecycleEmail(savedOrder, "created");
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

    public OrderResponse trackOrder(Long id, String phone) {
        if (isBlank(phone)) {
            throw new IllegalArgumentException("Phone number is required");
        }

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        if (!isOrderPhoneMatch(order, phone)) {
            throw new ResourceNotFoundException("No order found for this order ID and phone number");
        }

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

        sendOrderLifecycleEmail(updatedOrder, "updated");

        return mapToResponse(updatedOrder);
    }

    public void sendDeliveryOtp(Long id) {
        Long adminId = getAuthenticatedUserId();

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        String receiverPhone = getDeliveryOtpPhone(order);
        String deliveryOtp = phoneOtpService.createOtpForPhone(receiverPhone);
        sendDeliveryOtpEmail(order, deliveryOtp);

        order.setUpdatedByUserID(adminId);
        order.setUpdatedDateTime(LocalDateTime.now());
        ordersRepo.save(order);
    }

    public OrderResponse deliverOrder(Long id, OrderDeliveryRequest request) {
        Long adminId = getAuthenticatedUserId();

        if (request == null || isBlank(request.getOtp())) {
            throw new IllegalArgumentException("Delivery OTP is required");
        }

        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException("Final amount is required");
        }

        if (request.getWeight() == null || request.getWeight() <= 0) {
            throw new IllegalArgumentException("Final weight is required");
        }

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        String receiverPhone = getDeliveryOtpPhone(order);

        try {
            phoneOtpService.verifyOtp(receiverPhone, request.getOtp().trim());
        } catch (RuntimeException e) {
            throw new IllegalArgumentException(e.getMessage());
        }

        order.setUpdatedByUserID(adminId);
        order.setAmount(request.getAmount());
        order.setWeight(request.getWeight());
        order.setStatus("Delivered");
        order.setUpdatedDateTime(LocalDateTime.now());

        Orders updatedOrder = ordersRepo.save(order);

        sendOrderLifecycleEmail(updatedOrder, "delivered");

        return mapToResponse(updatedOrder);
    }

    public OrderResponse acceptOrder(Long id) {
        Long adminId = getAuthenticatedUserId();

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        if (order.getPickscheduleById() != null) {
            if (order.getPickscheduleById().equals(adminId)) {
                return mapToResponse(order);
            }

            throw new IllegalArgumentException("Order is already assigned to another admin");
        }

        order.setPickscheduleById(adminId);
        order.setUpdatedByUserID(adminId);
        order.setStatus("Scheduled");
        order.setUpdatedDateTime(LocalDateTime.now());

        Orders updatedOrder = ordersRepo.save(order);

        sendOrderLifecycleEmail(updatedOrder, "accepted");

        return mapToResponse(updatedOrder);
    }

    public OrderResponse assignOrder(Long id, OrderAssignmentRequest request) {
        Long currentAdminId = getAuthenticatedUserId();

        if (request == null || request.getAdminId() == null) {
            throw new IllegalArgumentException("Admin ID is required");
        }

        User assignedAdmin = userRepository.findByIdAndDeletedFalse(request.getAdminId())
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
        order.setStatus("Scheduled");
        order.setUpdatedDateTime(LocalDateTime.now());

        Orders updatedOrder = ordersRepo.save(order);

        sendAdminAssignmentEmail(updatedOrder, assignedAdmin, "assigned");

        return mapToResponse(updatedOrder);
    }

    public OrderResponse unassignOrder(Long id) {
        Long currentAdminId = getAuthenticatedUserId();

        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));

        User removedAdmin = order.getPickscheduleById() == null
                ? null
                : userRepository.findByIdAndDeletedFalse(order.getPickscheduleById()).orElse(null);

        order.setPickscheduleById(null);
        order.setUpdatedByUserID(currentAdminId);
        order.setUpdatedDateTime(LocalDateTime.now());
        Orders updatedOrder = ordersRepo.save(order);

        sendAdminAssignmentEmail(updatedOrder, removedAdmin, "removed");

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

        sendOrderLifecycleEmail(updatedOrder, "rescheduled");

        return mapToResponse(updatedOrder);
    }

    // CANCEL ORDER
    public OrderResponse deleteOrder(Long id) {
        Orders order = ordersRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id));
        User currentUser = getCurrentUserOrNull();

        if (currentUser == null) {
            throw new AccessDeniedException("Authentication is required to cancel an order");
        }

        if (!isAdminRole(currentUser.getRole())
                && !currentUser.getId().equals(order.getCreatedByUserID())) {
            throw new AccessDeniedException("You can only cancel your own orders");
        }

        order.setStatus("Cancellation");
        order.setUpdatedByUserID(currentUser.getId());
        order.setUpdatedDateTime(LocalDateTime.now());

        Orders updatedOrder = ordersRepo.save(order);

        sendOrderLifecycleEmail(updatedOrder, "cancelled");

        return mapToResponse(updatedOrder);
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

        if (request.getEstimateWeight() == null || request.getEstimateWeight() <= 0) {
            throw new IllegalArgumentException(
                    "Estimated weight is required");
        }

        validateTimeRange(request.getStartRange(), request.getEndRange());


        if (request.getCategoryIDsWithSubcatIDs() == null || request.getCategoryIDsWithSubcatIDs().isEmpty()) {
            throw new IllegalArgumentException(
                    "SubCategory ID is required");
        }

        if (request.getAddress() == null) {
            throw new IllegalArgumentException(
                    "Address is required");
        }

        AddressRequest address = request.getAddress();

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

    private Address resolveOrderAddress(AddressRequest requestAddress) {
        User currentUser = getCurrentUserOrNull();

        if (requestAddress.getId() != null) {
            Address existingAddress = addressRepo.findById(requestAddress.getId())
                    .filter(address -> !address.isDeleted())
                    .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + requestAddress.getId()));

            if (currentUser != null
                    && existingAddress.getUser() != null
                    && currentUser.getId().equals(existingAddress.getUser().getId())) {
                return existingAddress;
            }

            throw new AccessDeniedException("You can only use your own saved address");
        }

        if (currentUser != null) {
            for (Address existingAddress : addressRepo.findAllByUserIdAndDeletedFalse(currentUser.getId())) {
                if (isSameAddress(existingAddress, requestAddress)) {
                    return existingAddress;
                }
            }
        }

        Address address = new Address();

        address.setApartment(requestAddress.getApartment());
        address.setCity(requestAddress.getCity());
        address.setState(requestAddress.getState());
        address.setZip(requestAddress.getZip());
        address.setCountry(requestAddress.getCountry());
        address.setReceiverFirstName(requestAddress.getReceiverFirstName());
        address.setReceiverLastName(requestAddress.getReceiverLastName());
        address.setReceiverPhone(requestAddress.getReceiverPhone());
        address.setReceiverEmail(requestAddress.getReceiverEmail());
        address.setCountryCode(requestAddress.getCountryCode());
        address.setUser(currentUser);

        return addressRepo.save(address);
    }

    private boolean isSameAddress(Address existingAddress, AddressRequest requestAddress) {
        return normalized(existingAddress.getApartment()).equals(normalized(requestAddress.getApartment()))
                && normalized(existingAddress.getCity()).equals(normalized(requestAddress.getCity()))
                && normalized(existingAddress.getState()).equals(normalized(requestAddress.getState()))
                && normalized(existingAddress.getZip()).equals(normalized(requestAddress.getZip()))
                && normalized(existingAddress.getCountry()).equals(normalized(requestAddress.getCountry()))
                && normalized(existingAddress.getReceiverFirstName()).equals(normalized(requestAddress.getReceiverFirstName()))
                && normalized(existingAddress.getReceiverLastName()).equals(normalized(requestAddress.getReceiverLastName()))
                && normalized(existingAddress.getReceiverEmail()).equals(normalized(requestAddress.getReceiverEmail()))
                && canonicalPhone(digitsOnly(existingAddress.getReceiverPhone())).equals(canonicalPhone(digitsOnly(requestAddress.getReceiverPhone())))
                && normalized(existingAddress.getCountryCode()).equals(normalized(requestAddress.getCountryCode()));
    }

    private String normalized(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private String getDeliveryOtpPhone(Orders order) {
        User createdByUser = getOrderCreator(order);

        if (createdByUser != null && !isBlank(createdByUser.getPhone())) {
            return createdByUser.getPhone().trim();
        }

        if (order.getAddress() != null && !isBlank(order.getAddress().getReceiverPhone())) {
            return order.getAddress().getReceiverPhone().trim();
        }

        throw new IllegalArgumentException("Pickup phone number is required for delivery OTP");
    }

    private boolean isOrderPhoneMatch(Orders order, String requestedPhone) {
        String requestedDigits = digitsOnly(requestedPhone);

        if (requestedDigits.isEmpty()) {
            return false;
        }

        for (String orderPhone : getOrderContactPhones(order)) {
            String orderDigits = digitsOnly(orderPhone);

            if (!orderDigits.isEmpty()
                    && (requestedDigits.equals(orderDigits)
                    || canonicalPhone(requestedDigits).equals(canonicalPhone(orderDigits)))) {
                return true;
            }
        }

        return false;
    }

    private List<String> getOrderContactPhones(Orders order) {
        List<String> phones = new ArrayList<>();

        if (order.getAddress() != null && !isBlank(order.getAddress().getReceiverPhone())) {
            phones.add(order.getAddress().getReceiverPhone().trim());
        }

        User createdByUser = getOrderCreator(order);

        if (createdByUser != null && !isBlank(createdByUser.getPhone())) {
            phones.add(createdByUser.getPhone().trim());
        }

        return phones;
    }

    private String digitsOnly(String value) {
        if (value == null) {
            return "";
        }

        return value.replaceAll("\\D", "");
    }

    private String canonicalPhone(String digits) {
        if (digits == null) {
            return "";
        }

        String normalized = digits;

        while (normalized.length() > 10 && normalized.startsWith("0")) {
            normalized = normalized.substring(1);
        }

        if (normalized.length() > 10 && normalized.startsWith("91")) {
            normalized = normalized.substring(normalized.length() - 10);
        }

        return normalized.length() > 10
                ? normalized.substring(normalized.length() - 10)
                : normalized;
    }

    private String getDeliveryOtpEmail(Orders order) {
        User createdByUser = getOrderCreator(order);

        if (createdByUser != null && !isBlank(createdByUser.getEmail())) {
            return createdByUser.getEmail().trim().toLowerCase();
        }

        if (order.getAddress() != null && !isBlank(order.getAddress().getReceiverEmail())) {
            return order.getAddress().getReceiverEmail().trim().toLowerCase();
        }

        throw new IllegalArgumentException("Pickup email is required for delivery OTP");
    }

    private User getOrderCreator(Orders order) {
        Long createdByUserId = order.getCreatedByUserID();

        if (createdByUserId == null || GUEST_USER_ID.equals(createdByUserId)) {
            return null;
        }

        return userRepository.findByIdAndDeletedFalse(createdByUserId).orElse(null);
    }

    private void sendDeliveryOtpEmail(Orders order, String otp) {
        String receiverEmail = getDeliveryOtpEmail(order);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(receiverEmail);
        message.setSubject("Delivery OTP for Scrapify pickup #" + order.getId());
        message.setText(
                "Hi,\n\n"
                        + "Your Scrapify pickup is ready for completion. Share this OTP with the pickup admin only after your scrap has been weighed and the final amount has been confirmed.\n\n"
                        + "Order #" + order.getId() + "\n"
                        + "Delivery OTP: " + otp + "\n"
                        + "Valid for: 5 minutes\n"
                        + "Pickup date: " + formatPickupDate(order) + "\n"
                        + "Pickup window: " + formatPickupWindow(order) + "\n"
                        + "Estimated weight: " + formatWeight(order.getEstimateWeight()) + "\n\n"
                        + "Do not share this OTP before completion. Scrapify support will never ask for your OTP outside the pickup flow.\n\n"
                        + "Thanks,\n"
                        + "Scrapify Team"
        );

        mailSender.send(message);
    }

    private void sendOrderLifecycleEmail(Orders order, String event) {
        String receiverEmail = getOrderContactEmail(order);

        if (mailSender == null || isBlank(receiverEmail)) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(receiverEmail);
        message.setSubject(getOrderEmailSubject(order, event));
        message.setText(getOrderEmailBody(order, event));

        try {
            mailSender.send(message);
        } catch (RuntimeException exception) {
            System.err.println("Failed to send order " + event + " email for order #"
                    + order.getId() + ": " + exception.getMessage());
        }
    }

    private void sendAdminAssignmentEmail(Orders order, User admin, String event) {
        if (mailSender == null || admin == null || isBlank(admin.getEmail())) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(admin.getEmail().trim().toLowerCase());
        message.setSubject(getAdminAssignmentSubject(order, event));
        message.setText(getAdminAssignmentBody(order, admin, event));

        try {
            mailSender.send(message);
        } catch (RuntimeException exception) {
            System.err.println("Failed to send admin " + event + " email for order #"
                    + order.getId() + ": " + exception.getMessage());
        }
    }

    private String getAdminAssignmentSubject(Orders order, String event) {
        if ("removed".equals(event)) {
            return "Removed from Scrapify pickup #" + order.getId();
        }

        return "Assigned to Scrapify pickup #" + order.getId();
    }

    private String getAdminAssignmentBody(Orders order, User admin, String event) {
        return "Hi " + getUserDisplayName(admin) + ",\n\n"
                + getAdminAssignmentMessage(event) + "\n\n"
                + "Pickup details:\n"
                + "Order ID: #" + order.getId() + "\n"
                + "Status: " + formatStatus(order.getStatus()) + "\n"
                + "Pickup date: " + formatPickupDate(order) + "\n"
                + "Pickup window: " + formatPickupWindow(order) + "\n"
                + "Estimated weight: " + formatWeight(order.getEstimateWeight()) + "\n"
                + "Customer: " + getOrderCustomerName(order) + "\n"
                + "Address: " + formatAddress(order.getAddress()) + "\n\n"
                + getAdminAssignmentFooter(event) + "\n\n"
                + "Thanks,\n"
                + "Scrapify Team";
    }

    private String getAdminAssignmentMessage(String event) {
        if ("removed".equals(event)) {
            return "You have been removed from this pickup assignment.";
        }

        return "A pickup has been assigned to you. Please review the details and manage it from the admin dashboard.";
    }

    private String getAdminAssignmentFooter(String event) {
        if ("removed".equals(event)) {
            return "No further action is needed unless this was unexpected.";
        }

        return "Keep the customer updated and request the delivery OTP only when the pickup is ready for completion.";
    }

    private String getOrderContactEmail(Orders order) {
        User createdByUser = getOrderCreator(order);

        if (createdByUser != null && !isBlank(createdByUser.getEmail())) {
            return createdByUser.getEmail().trim().toLowerCase();
        }

        if (order.getAddress() != null && !isBlank(order.getAddress().getReceiverEmail())) {
            return order.getAddress().getReceiverEmail().trim().toLowerCase();
        }

        return null;
    }

    private String getOrderEmailSubject(Orders order, String event) {
        return switch (event) {
            case "created" -> "Scrapify pickup #" + order.getId() + " created";
            case "rescheduled" -> "Scrapify pickup #" + order.getId() + " rescheduled";
            case "cancelled" -> "Scrapify pickup #" + order.getId() + " cancelled";
            default -> "Scrapify pickup #" + order.getId() + " updated";
        };
    }

    private String getOrderEmailBody(Orders order, String event) {
        return "Hi " + getOrderCustomerName(order) + ",\n\n"
                + getOrderEventMessage(event) + "\n\n"
                + "Pickup details:\n"
                + "Order ID: #" + order.getId() + "\n"
                + "Status: " + formatStatus(order.getStatus()) + "\n"
                + "Pickup date: " + formatPickupDate(order) + "\n"
                + "Pickup window: " + formatPickupWindow(order) + "\n"
                + "Estimated weight: " + formatWeight(order.getEstimateWeight()) + "\n"
                + "Address: " + formatAddress(order.getAddress()) + "\n\n"
                + getOrderEventFooter(event) + "\n\n"
                + "Thanks,\n"
                + "Scrapify Team";
    }

    private String getOrderEventMessage(String event) {
        return switch (event) {
            case "created" ->
                    "Your pickup request has been created successfully. Our team will review it and keep you updated.";
            case "rescheduled" ->
                    "Your pickup schedule has been updated. Please check the new pickup date and time below.";
            case "cancelled" -> "Your pickup has been cancelled. No pickup will be attempted for this order.";
            default -> "Your pickup details have been updated. Please review the latest details below.";
        };
    }

    private String getOrderEventFooter(String event) {
        return switch (event) {
            case "cancelled" -> "If this cancellation was not expected, please contact Scrapify support.";
            case "created" -> "You can track this pickup from your Scrapify dashboard.";
            default -> "You can view the latest status from your Scrapify dashboard.";
        };
    }

    private String getOrderCustomerName(Orders order) {
        User createdByUser = getOrderCreator(order);

        if (createdByUser != null) {
            String fullName = getUserDisplayName(createdByUser);

            if (!"there".equals(fullName)) {
                return fullName;
            }
        }

        if (order.getAddress() != null) {
            String fullName = ((order.getAddress().getReceiverFirstName() == null ? "" : order.getAddress().getReceiverFirstName().trim())
                    + " "
                    + (order.getAddress().getReceiverLastName() == null ? "" : order.getAddress().getReceiverLastName().trim())).trim();

            if (!fullName.isEmpty()) {
                return fullName;
            }
        }

        return "there";
    }

    private String getUserDisplayName(User user) {
        String fullName = ((user.getFirstName() == null ? "" : user.getFirstName().trim())
                + " "
                + (user.getLastName() == null ? "" : user.getLastName().trim())).trim();

        return fullName.isEmpty() ? "there" : fullName;
    }

    private String formatStatus(String status) {
        return isBlank(status) ? "-" : status;
    }

    private String formatAddress(Address address) {
        if (address == null) {
            return "-";
        }

        List<String> parts = new ArrayList<>();
        addIfPresent(parts, address.getApartment());
        addIfPresent(parts, address.getCity());
        addIfPresent(parts, address.getState());
        addIfPresent(parts, address.getZip());
        addIfPresent(parts, address.getCountry());

        return parts.isEmpty() ? "-" : String.join(", ", parts);
    }

    private void addIfPresent(List<String> parts, String value) {
        if (!isBlank(value)) {
            parts.add(value.trim());
        }
    }

    private String formatPickupDate(Orders order) {
        if (order.getPickupDate() == null) {
            return "-";
        }

        return java.time.Instant.ofEpochMilli(order.getPickupDate().getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .format(PICKUP_DATE_FORMATTER);
    }

    private String formatPickupWindow(Orders order) {
        if (order.getStartRange() == null && order.getEndRange() == null) {
            return "-";
        }

        return formatTime(order.getStartRange()) + " - " + formatTime(order.getEndRange());
    }

    private String formatTime(java.sql.Time time) {
        return time == null ? "-" : time.toLocalTime().toString();
    }

    private String formatWeight(Float weight) {
        return weight == null ? "-" : weight + " kg";
    }

    // MAP REQUEST DTO -> ENTITY
    private void mapRequestToEntity(
            OrderRequest request,
            Orders order) {

        order.setPickupDate(request.getPickupDate());

        order.setStartRange(request.getStartRange());

        order.setEndRange(request.getEndRange());

        order.setEstimateWeight(request.getEstimateWeight());
        order.setCategorySubcategoryPairs(request.getCategoryIDsWithSubcatIDs());

    }

    // MAP ENTITY -> RESPONSE DTO
    private OrderResponse mapToResponse(Orders order) {

        OrderResponse response = new OrderResponse();
        response.setCategorySubcategoryPairs(mapCategoryPairsToResponse(order.getCategorySubcategoryPairs()));
        response.setId(order.getId());

        response.setStatus(order.getStatus());

        response.setEstimateWeight(order.getEstimateWeight());

        response.setWeight(order.getWeight());

        response.setAmount(order.getAmount());

        response.setPickupDate(order.getPickupDate());

        response.setStartRange(order.getStartRange());

        response.setEndRange(order.getEndRange());

        response.setAddress(mapAddressToResponse(order.getAddress()));

        response.setCreatedByUserID(order.getCreatedByUserID());

        User createdByUser = getOrderCreator(order);
        if (createdByUser != null) {
            response.setCreatedByName(getUserDisplayName(createdByUser));
            response.setCreatedByEmail(createdByUser.getEmail());
        }

        response.setUpdatedByUserID(order.getUpdatedByUserID());

        response.setPickscheduleById(order.getPickscheduleById());
        response.setCreatedDateTime(order.getCreatedDateTime());

        response.setUpdatedDateTime(order.getUpdatedDateTime());

        return response;
    }

    private List<CategoryResponse> mapCategoryPairsToResponse(HashMap<Long, List<Long>> categoryPairs) {
        if (categoryPairs == null || categoryPairs.isEmpty()) {
            return new ArrayList<>();
        }

        return categoryPairs.entrySet()
                .stream()
                .map((entry) -> {
                    CategoryResponse category = getCategoryResponseOrFallback(entry.getKey());
                    List<SubCategoryResponse> subCategories = entry.getValue() == null
                            ? new ArrayList<>()
                            : entry.getValue()
                                    .stream()
                                    .map(this::getSubCategoryResponseOrFallback)
                                    .collect(Collectors.toList());

                    category.setSubCategories(subCategories);
                    return category;
                })
                .collect(Collectors.toList());
    }

    private CategoryResponse getCategoryResponseOrFallback(Long categoryId) {
        try {
            return categoryService.getCategoryById(categoryId);
        } catch (RuntimeException exception) {
            CategoryResponse response = new CategoryResponse();
            response.setId(categoryId);
            response.setCategory("Category " + categoryId);
            return response;
        }
    }

    private SubCategoryResponse getSubCategoryResponseOrFallback(Long subCategoryId) {
        try {
            return subCategoryService.getSubCategoryById(subCategoryId);
        } catch (RuntimeException exception) {
            SubCategoryResponse response = new SubCategoryResponse();
            response.setId(subCategoryId);
            response.setSubCategory("Subcategory " + subCategoryId);
            return response;
        }
    }

    private String serializeCategoryPairs(HashMap<Long, List<Long>> categoryPairs) {
        if (categoryPairs == null || categoryPairs.isEmpty()) {
            return "";
        }

        return categoryPairs.entrySet()
                .stream()
                .map((entry) -> entry.getKey() + ":" + entry.getValue()
                        .stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining(",")))
                .collect(Collectors.joining(";"));
    }

    private HashMap<Long, List<Long>> deserializeCategoryPairs(String categoryPairs) {
        if (isBlank(categoryPairs)) {
            return new HashMap<>();
        }

        HashMap<Long, List<Long>> result = new HashMap<>();

        for (String pair : categoryPairs.split(";")) {
            if (isBlank(pair) || !pair.contains(":")) {
                continue;
            }

            String[] parts = pair.split(":", 2);

            try {
                Long categoryId = Long.parseLong(parts[0].trim());
                List<Long> subCategoryIds = new ArrayList<>();

                for (String rawSubCategoryId : parts[1].split(",")) {
                    if (!isBlank(rawSubCategoryId)) {
                        subCategoryIds.add(Long.parseLong(rawSubCategoryId.trim()));
                    }
                }

                if (!subCategoryIds.isEmpty()) {
                    result.put(categoryId, subCategoryIds);
                }
            } catch (NumberFormatException ignored) {
                // Skip malformed persisted values instead of breaking order reads.
            }
        }

        return result;
    }

    private AddressResponse mapAddressToResponse(Address address) {
        if (address == null) {
            return null;
        }

        return getAddressResponse(address);
    }

    @NonNull
    static AddressResponse getAddressResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setApartment(address.getApartment());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setZip(address.getZip());
        response.setCountry(address.getCountry());
        response.setReceiverFirstName(address.getReceiverFirstName());
        response.setReceiverLastName(address.getReceiverLastName());
        response.setReceiverPhone(address.getReceiverPhone());
        response.setReceiverEmail(address.getReceiverEmail());
        response.setCountryCode(address.getCountryCode());

        return response;
    }

    public List<OrderResponse> getAllOrderByUser(Long id) {
        User currentUser = getCurrentUserOrNull();

        if (currentUser == null) {
            throw new AccessDeniedException("Authentication is required to view orders");
        }

        if (!isAdminRole(currentUser.getRole()) && !currentUser.getId().equals(id)) {
            throw new AccessDeniedException("You can only view your own orders");
        }

        return getOrdersForUser(id);
    }

    public List<OrderResponse> getCurrentUserOrders() {
        User currentUser = getCurrentUserOrNull();

        if (currentUser == null) {
            throw new AccessDeniedException("Authentication is required to view orders");
        }

        return getOrdersForUser(currentUser.getId());
    }

    private List<OrderResponse> getOrdersForUser(Long id) {
        User requestedUser = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        LinkedHashMap<Long, Orders> userOrdersById = new LinkedHashMap<>();

        for (Orders order : ordersRepo.findAllByCreatedByUserIDOrderByCreatedDateTimeDesc(id)) {
            userOrdersById.put(order.getId(), order);
        }

        for (Orders order : ordersRepo.findAll()) {
            if (isGuestOrderForUser(order, requestedUser)) {
                userOrdersById.putIfAbsent(order.getId(), order);
            }
        }

        return userOrdersById.values()
                .stream()
                .sorted((first, second) -> {
                    LocalDateTime firstCreated = first.getCreatedDateTime();
                    LocalDateTime secondCreated = second.getCreatedDateTime();

                    if (firstCreated == null && secondCreated == null) {
                        return 0;
                    }

                    if (firstCreated == null) {
                        return 1;
                    }

                    if (secondCreated == null) {
                        return -1;
                    }

                    return secondCreated.compareTo(firstCreated);
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private boolean isGuestOrderForUser(Orders order, User user) {
        if (order == null || user == null || !GUEST_USER_ID.equals(order.getCreatedByUserID())) {
            return false;
        }

        Address address = order.getAddress();

        if (address == null) {
            return false;
        }

        if (!isBlank(user.getEmail())
                && !isBlank(address.getReceiverEmail())
                && user.getEmail().trim().equalsIgnoreCase(address.getReceiverEmail().trim())) {
            return true;
        }

        return !isBlank(user.getPhone())
                && !isBlank(address.getReceiverPhone())
                && canonicalPhone(digitsOnly(user.getPhone()))
                        .equals(canonicalPhone(digitsOnly(address.getReceiverPhone())));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || authentication.getName() == null
                || "anonymousUser".equals(authentication.getName())
                || !authentication.isAuthenticated()) {
            return GUEST_USER_ID;
        }

        User user = userRepository.findByUsernameAndDeletedFalse(authentication.getName())
                .orElseGet(() -> userRepository.findByEmailAndDeletedFalse(authentication.getName()).orElse(null));

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

        return userRepository.findByUsernameAndDeletedFalse(authentication.getName())
                .orElseGet(() -> userRepository.findByEmailAndDeletedFalse(authentication.getName()).orElse(null));
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || authentication.getName() == null
                || "anonymousUser".equals(authentication.getName())
                || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("Authenticated admin is required");
        }

        User user = userRepository.findByUsernameAndDeletedFalse(authentication.getName())
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
