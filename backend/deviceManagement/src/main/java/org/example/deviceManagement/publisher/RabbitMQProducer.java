package org.example.deviceManagement.publisher;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.deviceManagement.model.Device;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class RabbitMQProducer {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    @Autowired
    public RabbitMQProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public void sendDeviceSyncMessage(Device device, boolean isDelete) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("deviceId", device.getId().toString());

            if (isDelete) {
                message.put("delete", true);
            } else {
                message.put("maxConsumption", device.getMaxHourlyConsumption());
                message.put("userId", device.getUserId());
            }

            String jsonMessage = objectMapper.writeValueAsString(message);

            rabbitTemplate.convertAndSend(exchange, routingKey, jsonMessage);

            System.out.println("Sent sync message: " + jsonMessage);
        } catch (Exception e) {
            System.err.println("Error while sending device sync message: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
