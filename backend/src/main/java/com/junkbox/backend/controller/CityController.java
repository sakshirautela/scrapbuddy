package com.junkbox.backend.controller;

import com.junkbox.backend.dto.request.CityRequest;
import com.junkbox.backend.dto.response.CityResponse;
import com.junkbox.backend.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SUPERADMIN')")
    public ResponseEntity<?> createCity(@RequestBody CityRequest request) {
        try{
            CityResponse createdCity = cityService.createCity(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCity);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CityResponse> getCityById(@PathVariable Long id) {
        CityResponse city = cityService.getCityById(id);
        return ResponseEntity.ok(city);
    }

    @GetMapping
    public ResponseEntity<List<CityResponse>> getAllCities() {
        List<CityResponse> cities = cityService.getAllCities();
        return ResponseEntity.ok(cities);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SUPERADMIN')")
    public ResponseEntity<CityResponse> updateCity(@PathVariable Long id, @RequestBody CityRequest request) {
        CityResponse updatedCity = cityService.updateCity(id, request);
        return ResponseEntity.ok(updatedCity);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SUPERADMIN')")
    public ResponseEntity<Void> deleteCity(@PathVariable Long id) {
        cityService.deleteCity(id);
        return ResponseEntity.noContent().build();
    }
}
