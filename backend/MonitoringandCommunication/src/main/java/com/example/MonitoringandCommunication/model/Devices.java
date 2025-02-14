package com.example.MonitoringandCommunication.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Entity
@Data
public class Devices {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String deviceId;
    private Double maxConsumption;
    private Long userId;

    public Devices() {}

    public Devices(String deviceId, Double maxConsumption, Long userId) {
        this.deviceId = deviceId;
        this.maxConsumption = maxConsumption;
        this.userId = userId;
    }

}
