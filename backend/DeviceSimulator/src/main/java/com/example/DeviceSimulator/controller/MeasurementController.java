package com.example.DeviceSimulator.controller;

import com.example.DeviceSimulator.model.MeasurementData;
import com.example.DeviceSimulator.publisher.RabbitMQProducer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
public class MeasurementController {

    private final RabbitMQProducer producer;

    public MeasurementController(RabbitMQProducer producer) {
        this.producer = producer;
    }

    @GetMapping("/send")
    public ResponseEntity<String> sendMeasurement(
            @RequestParam LocalDateTime timestamp,
            @RequestParam String deviceId,
            @RequestParam double value) {

        MeasurementData data = new MeasurementData();
        data.setTimestamp(timestamp);
        data.setDeviceId(deviceId);
        data.setMeasurementValue(value);

        producer.sendMeasurement(data);

        return ResponseEntity.ok("Measurement sent to RabbitMQ");
    }
}
