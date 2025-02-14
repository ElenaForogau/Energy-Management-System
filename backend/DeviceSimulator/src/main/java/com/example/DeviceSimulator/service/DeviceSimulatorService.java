package com.example.DeviceSimulator.service;

import com.example.DeviceSimulator.config.DeviceConfiguration;
import com.example.DeviceSimulator.model.MeasurementData;
import com.example.DeviceSimulator.publisher.RabbitMQProducer;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
public class DeviceSimulatorService {
    private final RabbitMQProducer producer;
    private final String deviceId;

    public DeviceSimulatorService(RabbitMQProducer producer, DeviceConfiguration deviceConfiguration) {
        this.producer = producer;
        this.deviceId = deviceConfiguration.getDeviceId();

        if (this.deviceId == null || this.deviceId.isEmpty()) {
            throw new IllegalArgumentException("Device ID is not configured. Please check your configuration.");
        }
    }

    public void runSimulator() {
        String filePath = "sensor.csv";
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                double measurementValue;
                try {
                    measurementValue = Double.parseDouble(line.trim());
                } catch (NumberFormatException e) {
                    System.err.println("Error parsing measurement value: " + line);
                    continue;
                }

                LocalDateTime timestamp = LocalDateTime.now();

                MeasurementData data = new MeasurementData();
                data.setTimestamp(timestamp);
                data.setDeviceId(deviceId);
                data.setMeasurementValue(measurementValue);

                producer.sendMeasurement(data);

                System.out.println("Sent data: " + data);

                TimeUnit.SECONDS.sleep(10);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
