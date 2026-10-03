package com.smartevent.inventory.controller;

import com.smartevent.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/reserve/{seatId}")
    public ResponseEntity<String> reserveSeat(@PathVariable Long seatId) {
        boolean success = inventoryService.reserveSeat(seatId);
        if (success) {
            return ResponseEntity.ok("Seat " + seatId + " reserved successfully.");
        }
        return ResponseEntity.badRequest().body("Seat " + seatId + " is not available or does not exist.");
    }

    @PostMapping("/release/{seatId}")
    public ResponseEntity<String> releaseSeat(@PathVariable Long seatId) {
        boolean success = inventoryService.releaseSeat(seatId);
        if (success) {
            return ResponseEntity.ok("Seat " + seatId + " released successfully.");
        }
        return ResponseEntity.badRequest().body("Seat " + seatId + " could not be released.");
    }
}