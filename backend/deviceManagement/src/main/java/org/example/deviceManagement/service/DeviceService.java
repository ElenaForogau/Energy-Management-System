package org.example.deviceManagement.service;

import lombok.RequiredArgsConstructor;
import org.example.deviceManagement.model.Device;
import org.example.deviceManagement.publisher.RabbitMQProducer;
import org.example.deviceManagement.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class DeviceService implements IDeviceService {

    private final DeviceRepository deviceRepository;
    private final RabbitMQProducer rabbitMQProducer;
    private static final Logger logger = LoggerFactory.getLogger(DeviceService.class);

    @Override
    public Device createDevice(Device device) {
        Device newDevice = deviceRepository.save(device);
        rabbitMQProducer.sendDeviceSyncMessage(newDevice, false);
        return newDevice;
    }

    @Override
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @Override
    public Device getDeviceById(Long id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found"));
    }

    @Override
    public Device updateDevice(Long id, Device updatedDevice) {
        Device existingDevice = getDeviceById(id);
        existingDevice.setDescription(updatedDevice.getDescription());
        existingDevice.setAddress(updatedDevice.getAddress());
        existingDevice.setMaxHourlyConsumption(updatedDevice.getMaxHourlyConsumption());
        existingDevice.setUserId(updatedDevice.getUserId());

        Device savedDevice = deviceRepository.save(existingDevice);
        rabbitMQProducer.sendDeviceSyncMessage(savedDevice, false);
        logger.info("Updated device: {}", savedDevice);
        return savedDevice;
    }

    @Override
    public List<Device> getDevicesByUserId(Long userId) {
        return deviceRepository.findByUserId(userId);
    }

    @Override
    public void deleteDevicesByUserId(Long userId) {
        List<Device> devices = deviceRepository.findByUserId(userId);
        System.out.println("Size: " + devices.size());
        for (Device device : devices) {
            logger.info("Deleting device with ID: {}", device.getId());
            deviceRepository.delete(device);
            rabbitMQProducer.sendDeviceSyncMessage(device, true);
        }
    }

    @Override
    public void deleteDevice(Long id) {
        Device device = getDeviceById(id);
        deviceRepository.deleteById(id);

        logger.info("Deleted device from DeviceManagement DB: {}", device);

        rabbitMQProducer.sendDeviceSyncMessage(device, true);
        logger.info("Sync message sent to RabbitMQ for device ID: {}", id);
    }
}

