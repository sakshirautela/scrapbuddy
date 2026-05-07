package com.junkbox.backend.controller;

import com.junkbox.backend.dto.RequestItem;
import com.junkbox.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/items")
public class ItemController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<String> createItem(@RequestBody RequestItem createItem) {
        long id = productService.createProduct(createItem);
        return ResponseEntity.ok().body(String.valueOf(id));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<HashMap<String, HashMap<String, Long>>> getAllItems(@PathVariable Long userId) {
        return ResponseEntity.ok(productService.getAllItems(userId));
    }

    @DeleteMapping("/{userId}/{category}/{itemName}")
    public ResponseEntity<String> deleteItem(@PathVariable Long userId, @PathVariable String category, @PathVariable String itemName) {
        boolean deleted = productService.deleteProduct(userId, category, itemName);
        if (deleted) {
            return ResponseEntity.ok("Item deleted");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}/{category}/{itemName}")
    public ResponseEntity<String> updateItem(@PathVariable Long userId, @PathVariable String category, @PathVariable String itemName, @RequestParam Long price) {
        boolean updated = productService.updateProduct(userId, category, itemName, price);
        if (updated) {
            return ResponseEntity.ok("Item updated");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
