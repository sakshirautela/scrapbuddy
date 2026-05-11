package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.AddressRequest;
import com.junkbox.backend.dto.response.AddressResponse;
import com.junkbox.backend.entity.Address;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.AddressRepo;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final AddressRepo addressRepo;

    public AddressService(AddressRepo addressRepo) {
        this.addressRepo = addressRepo;
    }

    // CREATE ADDRESS
    public AddressResponse createAddress(@Valid AddressRequest request) {

        validateAddress(request);

        Address address = new Address();

        address.setApartment(request.getApartment());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZip(request.getZip());
        address.setCountry(request.getCountry());
        address.setReceiverFirstName(request.getReceiverFirstName());
        address.setReceiverLastName(request.getReceiverLastName());
        address.setReceiverPhone(request.getReceiverPhone());
        address.setReceiverEmail(request.getReceiverEmail());
        address.setCountryCode(request.getCountryCode());

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

    // GET ADDRESS BY ID
    public AddressResponse getAddressById(Long id) {

        Address address = addressRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address not found with ID: " + id));

        return mapToResponse(address);
    }

    // UPDATE ADDRESS
    public AddressResponse updateAddress(
            Long id,
            @Valid AddressRequest request) {

        validateAddress(request);

        Address address = addressRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address not found with ID: " + id));

        address.setApartment(request.getApartment());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZip(request.getZip());
        address.setCountry(request.getCountry());
        address.setReceiverFirstName(request.getReceiverFirstName());
        address.setReceiverLastName(request.getReceiverLastName());
        address.setReceiverPhone(request.getReceiverPhone());
        address.setReceiverEmail(request.getReceiverEmail());
        address.setCountryCode(request.getCountryCode());

        Address updatedAddress = addressRepo.save(address);

        return mapToResponse(updatedAddress);
    }

    // DELETE ADDRESS
    public void deleteAddress(Long id) {

        Address address = addressRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address not found with ID: " + id));

        addressRepo.delete(address);
    }

    // VALIDATION
    private void validateAddress(AddressRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Address request cannot be null");
        }

        if (request.getCity() == null
                || request.getCity().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "City cannot be empty");
        }

        if (request.getReceiverPhone() == null
                || request.getReceiverPhone().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Receiver phone cannot be empty");
        }
    }

    // ENTITY -> RESPONSE DTO
    private AddressResponse mapToResponse(Address address) {

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
}