package com.junkbox.backend.service;

import com.junkbox.backend.dto.RequestItem;
import com.junkbox.backend.entity.User;
import com.junkbox.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class ProductService {

    @Autowired
    private UserRepository userRepository;

    public Long createProduct(RequestItem requestItem) {
        User user = userRepository.findById(requestItem.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getCatgories() == null) {
            user.setCatgories(new com.junkbox.backend.entity.Catgories());
        }
        if (user.getCatgories().getProductCategories() == null) {
            user.getCatgories().setProductCategories(new HashMap<>());
        }
        user.getCatgories().getProductCategories().computeIfAbsent(requestItem.getCategory(), k -> new HashMap<>()).put(requestItem.getItemName(), requestItem.getPrice());
        userRepository.save(user);
        return user.getId();
    }

    public boolean deleteProduct(Long userId, String category, String itemName) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getCatgories() != null && user.getCatgories().getProductCategories() != null) {
            HashMap<String, Long> catItems = user.getCatgories().getProductCategories().get(category);
            if (catItems != null) {
                catItems.remove(itemName);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    public boolean updateProduct(Long userId, String category, String itemName, Long price) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getCatgories() != null && user.getCatgories().getProductCategories() != null) {
            HashMap<String, Long> catItems = user.getCatgories().getProductCategories().get(category);
            if (catItems != null && catItems.containsKey(itemName)) {
                catItems.put(itemName, price);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    public HashMap<String, HashMap<String, Long>> getAllItems(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getCatgories() != null ? user.getCatgories().getProductCategories() : new HashMap<>();
    }
}