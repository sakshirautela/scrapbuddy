package com.junkbox.backend.repository;

import com.junkbox.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface AddressRepo extends JpaRepository<Address, Long > {
    List<Address> findAllByUserId(Long userId);
}
