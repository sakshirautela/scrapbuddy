package com.junkbox.backend.repository;

import com.junkbox.backend.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdersRepo extends JpaRepository<Orders, Long > {
    List<Orders> createdByUserID(String userID);
    List<Orders> updatedByUserID(String userID);
}