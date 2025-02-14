package com.example.MonitoringandCommunication.repository;

import com.example.MonitoringandCommunication.model.Devices;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DevicesRepository extends JpaRepository<Devices, Long> {
    Optional<Devices> findByDeviceId(String deviceId);
    void deleteByDeviceId(String deviceId);

}