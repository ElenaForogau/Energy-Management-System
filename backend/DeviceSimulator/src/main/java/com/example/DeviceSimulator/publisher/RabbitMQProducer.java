package com.example.DeviceSimulator.publisher;

import com.example.DeviceSimulator.config.DeviceConfiguration;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.DeviceSimulator.model.MeasurementData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Component
public class RabbitMQProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private DeviceConfiguration deviceConfiguration;

    private final ObjectMapper objectMapper;

    public RabbitMQProducer() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    public void sendMeasurement(MeasurementData data) {
        try {
            data.setDeviceId(deviceConfiguration.getDeviceId());

            String jsonMessage = objectMapper.writeValueAsString(data);

            rabbitTemplate.convertAndSend("your_queue_name", jsonMessage);

            System.out.println("Sent data: " + jsonMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

