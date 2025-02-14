package com.example.DeviceSimulator.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DeviceConfiguration {

    @Value("${device.id}")
    private String deviceId;

    public String getDeviceId() {
        return deviceId;
    }
}
