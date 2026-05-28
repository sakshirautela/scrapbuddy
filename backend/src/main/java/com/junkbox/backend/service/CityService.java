package com.junkbox.backend.service;

import com.junkbox.backend.dto.request.CityRequest;
import com.junkbox.backend.dto.response.CityResponse;
import com.junkbox.backend.entity.Cities;
import com.junkbox.backend.exception.ResourceNotFoundException;
import com.junkbox.backend.repository.CityRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepo cityRepo;

    public CityResponse createCity(CityRequest request) {
        Cities city = new Cities();
        city.setName(request.getName());
        Cities savedCity = cityRepo.save(city);
        return mapToResponse(savedCity);
    }

    public CityResponse getCityById(Long id) {
        Cities city = cityRepo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + id));
        return mapToResponse(city);
    }

    public List<CityResponse> getAllCities() {
        return cityRepo.findAllByDeletedFalse().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CityResponse updateCity(Long id, CityRequest request) {
        Cities city = cityRepo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + id));
        city.setName(request.getName());
        Cities updatedCity = cityRepo.save(city);
        return mapToResponse(updatedCity);
    }

    public void deleteCity(Long id) {
        Cities city = cityRepo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + id));
        city.setDeleted(true);
        cityRepo.save(city);
    }

    private CityResponse mapToResponse(Cities city) {
        CityResponse response = new CityResponse();
        response.setId(city.getId());
        response.setName(city.getName());
        return response;
    }
}
