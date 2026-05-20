package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.AddressRequest;
import com.junkbox.backend.dto.response.AddressResponse;
import com.junkbox.backend.entity.Address;
import com.junkbox.backend.entity.Orders;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.AddressRepo;
import com.junkbox.backend.repository.OrdersRepo;
import com.junkbox.backend.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final AddressRepo addressRepo;
    private final OrdersRepo ordersRepo;
    private final UserRepository userRepository;

    public AddressService(AddressRepo addressRepo,
                          OrdersRepo ordersRepo,
                          UserRepository userRepository) {
        this.addressRepo = addressRepo;
        this.ordersRepo = ordersRepo;
        this.userRepository = userRepository;
    }

    // CREATE ADDRESS
    public AddressResponse createAddress(@Valid AddressRequest request) {

        validateAddress(request);

        Address address = new Address();

        mapRequestToEntity(request, address);
        address.setUser(getCurrentUser());

        Address savedAddress = addressRepo.save(address);

        return mapToResponse(savedAddress);
    }

    // GET ALL ADDRESSES
    public List<AddressResponse> getAllAddress() {

        return addressRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET CURRENT USER ADDRESSES
    public List<AddressResponse> getCurrentUserAddresses() {

        User user = getCurrentUser();

        Map<Long, Address> addressesById = new LinkedHashMap<>();

        addressRepo.findAllByUserId(user.getId())
                .forEach(address -> addressesById.put(address.getId(), address));

        List<Address> orderAddresses = ordersRepo
                .findAllByCreatedByUserIDOrderByCreatedDateTimeDesc(user.getId())
                .stream()
                .map(Orders::getAddress)
                .filter(address -> address != null && address.getId() != null)
                .collect(Collectors.toList());

        orderAddresses.forEach(address -> {
            if (address.getUser() == null) {
                address.setUser(user);
                addressRepo.save(address);
            }

            addressesById.putIfAbsent(address.getId(), address);
        });

        return addressesById.values()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET ADDRESS BY ID
    public AddressResponse getAddressById(Long id) {

        Address address = findAddressById(id);

        return mapToResponse(address);
    }

    // UPDATE ADDRESS
    public AddressResponse updateAddress(Long id,
                                         @Valid AddressRequest request) {

        validateAddress(request);

        Address address = findAddressById(id);

        mapRequestToEntity(request, address);

        Address updatedAddress = addressRepo.save(address);

        return mapToResponse(updatedAddress);
    }

    // DELETE ADDRESS
    public void deleteAddress(Long id) {

        Address address = findAddressById(id);

        addressRepo.delete(address);
    }

    // COMMON FIND METHOD
    private Address findAddressById(Long id) {

        return addressRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address not found with ID: " + id));
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || authentication.getName() == null
                || "anonymousUser".equals(authentication.getName())
                || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("Authenticated user is required");
        }

        String principal = authentication.getName();

        Optional<User> user = userRepository.findByUsername(principal);

        if (user.isEmpty()) {
            user = userRepository.findByEmail(principal);
        }

        return user.orElseThrow(() ->
                new ResourceNotFoundException("User not found: " + principal));
    }

    // VALIDATION
    private void validateAddress(AddressRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Address request cannot be null");
        }

        if (isBlank(request.getReceiverFirstName())) {
            throw new IllegalArgumentException(
                    "Receiver first name cannot be empty");
        }

        if (isBlank(request.getReceiverPhone())) {
            throw new IllegalArgumentException(
                    "Receiver phone cannot be empty");
        }

        if (isBlank(request.getCity())) {
            throw new IllegalArgumentException(
                    "City cannot be empty");
        }

        if (isBlank(request.getCountry())) {
            throw new IllegalArgumentException(
                    "Country cannot be empty");
        }
    }

    // REUSABLE STRING CHECK
    private boolean isBlank(String value) {

        return value == null || value.trim().isEmpty();
    }

    // MAP REQUEST DTO -> ENTITY
    private void mapRequestToEntity(AddressRequest request,
                                    Address address) {

        address.setApartment(request.getApartment());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZip(request.getZip());
        address.setCountry(request.getCountry());

        address.setReceiverFirstName(
                request.getReceiverFirstName());

        address.setReceiverLastName(
                request.getReceiverLastName());

        address.setReceiverPhone(
                request.getReceiverPhone());

        address.setReceiverEmail(
                request.getReceiverEmail());

        address.setCountryCode(
                request.getCountryCode());
    }

    // MAP ENTITY -> RESPONSE DTO
    private AddressResponse mapToResponse(Address address) {

        AddressResponse response = new AddressResponse();

        response.setId(address.getId());
        response.setApartment(address.getApartment());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setZip(address.getZip());
        response.setCountry(address.getCountry());

        response.setReceiverFirstName(
                address.getReceiverFirstName());

        response.setReceiverLastName(
                address.getReceiverLastName());

        response.setReceiverPhone(
                address.getReceiverPhone());

        response.setReceiverEmail(
                address.getReceiverEmail());

        response.setCountryCode(
                address.getCountryCode());

        return response;
    }
}
