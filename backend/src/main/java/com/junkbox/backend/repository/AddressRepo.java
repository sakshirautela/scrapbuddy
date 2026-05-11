package com.junkbox.backend.repository;

import com.junkbox.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AddressRepo extends JpaRepository<Address, Long > {
}
