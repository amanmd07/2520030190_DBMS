package com.smartevent.inventory.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "seats")
public class Seat {
    @Id
    private Long seat_id;
    private Long event_id;
    private String status; // 'AVAILABLE', 'SELECTED', 'SOLD'

    public Seat() {}

    public Long getSeat_id() { return seat_id; }
    public void setSeat_id(Long seat_id) { this.seat_id = seat_id; }

    public Long getEvent_id() { return event_id; }
    public void setEvent_id(Long event_id) { this.event_id = event_id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}