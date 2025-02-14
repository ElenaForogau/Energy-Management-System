package org.example.deviceManagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("deviceId")
    private Long id;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private String address;
    @Column(nullable = false)
    @JsonProperty("maxHourlyConsumption")
    private Double maxHourlyConsumption;
    @Column(name = "user_id", nullable = true)
    @JsonProperty("userId")
    private Long userId;

}
