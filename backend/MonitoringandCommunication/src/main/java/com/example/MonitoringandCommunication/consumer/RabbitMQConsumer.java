package com.example.MonitoringandCommunication.consumer;

import com.example.MonitoringandCommunication.model.Management;
import com.example.MonitoringandCommunication.model.Devices;
import com.example.MonitoringandCommunication.repository.ManagementRepository;
import com.example.MonitoringandCommunication.repository.DevicesRepository;
import com.example.MonitoringandCommunication.service.WebSocketService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class RabbitMQConsumer {
    private final ManagementRepository managementRepository;
    private final DevicesRepository devicesRepository;
    private final WebSocketService webSocketService;
    private final ObjectMapper objectMapper;

    private final Map<String, List<Double>> deviceMeasurements = new HashMap<>();

    @Autowired
    public RabbitMQConsumer(ManagementRepository managementRepository,
                            DevicesRepository devicesRepository,
                            WebSocketService webSocketService) {
        this.managementRepository = managementRepository;
        this.devicesRepository = devicesRepository;
        this.webSocketService = webSocketService;

        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        this.objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }


    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void consumeMeasurementMessage(String message) {
        System.out.println("Received measurement message: " + message);

        try {
            Management data = objectMapper.readValue(message, Management.class);
            managementRepository.save(data);

            deviceMeasurements.putIfAbsent(data.getDeviceId(), new ArrayList<>());
            List<Double> measurements = deviceMeasurements.get(data.getDeviceId());
            measurements.add(data.getMeasurementValue());

            if (measurements.size() == 6) {
                double averageConsumption = measurements.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
                System.out.println("Average consumption for device " + data.getDeviceId() + ": " + averageConsumption);

                Devices device = devicesRepository.findByDeviceId(data.getDeviceId()).orElse(null);
                if (device != null) {
                    System.out.println("Device found: " + device);
                    System.out.println("Average consumption: " + averageConsumption);
                    System.out.println("Max consumption: " + device.getMaxConsumption());

                    if (averageConsumption > device.getMaxConsumption()) {
                        String notification = "Device " + data.getDeviceId() + " exceeded max consumption!";
                        System.out.println(notification);

                        if (device.getUserId() != null) {
                            System.out.println("Sending notification to user ID: " + device.getUserId());
                            webSocketService.notifyUser(device.getUserId(), notification);
                        } else {
                            System.out.println("User ID is null, cannot send notification.");
                        }
                    }
                } else {
                    System.out.println("Device not found for ID: " + data.getDeviceId());
                }

                measurements.clear();
            }

        } catch (Exception e) {
            System.err.println("Error processing measurement message: " + message);
            e.printStackTrace();
        }
    }
    @Transactional
    @RabbitListener(queues = "${rabbitmq.device.sync.queue}")
    public void consumeDeviceSyncMessage(String message) {
        System.out.println("Received device sync message: " + message);

        try {
            Map<String, Object> deviceData = objectMapper.readValue(message, Map.class);

            String deviceId = deviceData.get("deviceId").toString();

            if (deviceData.containsKey("delete") && (boolean) deviceData.get("delete")) {
                devicesRepository.deleteByDeviceId(deviceId);
                System.out.println("Device deleted from Devices table with ID: " + deviceId);

                managementRepository.deleteByDeviceId(deviceId);
                System.out.println("Measurements deleted from Management table for Device ID: " + deviceId);
                return;
            }


            Double maxConsumption = Double.parseDouble(deviceData.get("maxConsumption").toString());
            Long userId = deviceData.containsKey("userId") ? Long.parseLong(deviceData.get("userId").toString()) : null;


            Optional<Devices> optionalDevice = devicesRepository.findByDeviceId(deviceId);

            if (optionalDevice.isPresent()) {

                Devices device = optionalDevice.get();
                device.setMaxConsumption(maxConsumption);
                device.setUserId(userId);
                devicesRepository.save(device);
                System.out.println("Device updated: " + device);
            } else {

                Devices device = new Devices();
                device.setDeviceId(deviceId);
                device.setMaxConsumption(maxConsumption);
                device.setUserId(userId);
                devicesRepository.save(device);
                System.out.println("Device created: " + device);
            }

        } catch (Exception e) {
            System.err.println("Error processing device sync message: " + message);
            e.printStackTrace();
        }
    }

}
