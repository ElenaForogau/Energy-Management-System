package org.example.deviceManagement.service;

import org.example.deviceManagement.model.Device;
import java.util.List;

public interface IDeviceService {
    Device createDevice(Device device);
    List<Device> getAllDevices();
    Device getDeviceById(Long id);
    Device updateDevice(Long id, Device updatedDevice);
    void deleteDevice(Long id);
    void deleteDevicesByUserId(Long userId);
    List<Device> getDevicesByUserId(Long userId);
}
