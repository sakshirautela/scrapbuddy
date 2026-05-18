package com.junkbox.backend.repository;

import com.junkbox.backend.entity.Orders;
import jakarta.persistence.criteria.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface OrdersRepo extends JpaRepository<Orders, Long > {
    List<Orders> findAllByCreatedByUserIDOrderByCreatedDateTimeDesc(Long id);
}
