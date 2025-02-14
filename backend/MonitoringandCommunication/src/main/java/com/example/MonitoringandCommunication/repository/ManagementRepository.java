package com.example.MonitoringandCommunication.repository;

import com.example.MonitoringandCommunication.model.Management;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ManagementRepository extends JpaRepository<Management, Long> {
    @Query(value = "SELECT * FROM management m WHERE m.device_id = :deviceId AND DATE(m.timestamp) = :date", nativeQuery = true)
    List<Management> findByDeviceIdAndDate(@Param("deviceId") String deviceId, @Param("date") LocalDate date);
    void deleteByDeviceId(String deviceId);

}