package com.smartevent.inventory.service;

import com.smartevent.inventory.model.Seat;
import com.smartevent.inventory.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private SeatRepository seatRepository;

    @Transactional
    public boolean reserveSeat(Long seatId) {
        Optional<Seat> seatOpt = seatRepository.findByIdWithPessimisticLock(seatId);
        
        if (seatOpt.isPresent()) {
            Seat seat = seatOpt.get();
            if ("AVAILABLE".equals(seat.getStatus())) {
                seat.setStatus("SELECTED"); // Temporary hold
                seatRepository.save(seat);
                return true;
            }
        }
        return false;
    }

    @Transactional
    public boolean releaseSeat(Long seatId) {
        Optional<Seat> seatOpt = seatRepository.findById(seatId);
        
        if (seatOpt.isPresent()) {
            Seat seat = seatOpt.get();
            if ("SELECTED".equals(seat.getStatus())) {
                seat.setStatus("AVAILABLE");
                seatRepository.save(seat);
                return true;
            }
        }
        return false;
    }
}