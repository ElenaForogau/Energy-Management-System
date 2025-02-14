package com.example.MonitoringandCommunication.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class Management {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    @JsonProperty("deviceId")
    private String deviceId;

    @JsonProperty("measurementValue")
    private Double measurementValue;

    public Management() {
    }

    public Management(LocalDateTime timestamp, String deviceId, Double measurementValue) {
        this.deviceId = deviceId;
        this.measurementValue = measurementValue;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public Double getMeasurementValue() {
        return measurementValue;
    }

    public void setMeasurementValue(Double measurementValue) {
        this.measurementValue = measurementValue;
    }

    @Override
    public String toString() {
        return "Management{" +
                "id=" + id +
                ", timestamp=" + timestamp +
                ", deviceId='" + deviceId + '\'' +
                ", measurementValue=" + measurementValue +
                '}';
    }
}
