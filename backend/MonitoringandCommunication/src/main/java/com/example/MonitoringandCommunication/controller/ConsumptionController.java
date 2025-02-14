package com.example.MonitoringandCommunication.controller;

import com.example.MonitoringandCommunication.model.Management;
import com.example.MonitoringandCommunication.repository.ManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/consumption")
public class ConsumptionController {

    @Autowired
    private ManagementRepository managementRepository;

    @GetMapping("/{deviceId}/{date}")
    public List<Management> getConsumptionForDeviceAndDate(
            @PathVariable String deviceId,
            @PathVariable String date) {
        date = date.trim();
        System.out.println("Cleaned date: " + date);

        LocalDate selectedDate = LocalDate.parse(date);

        List<Management> results = managementRepository.findByDeviceIdAndDate(deviceId, selectedDate);
        System.out.println("Results found: " + results.size());
        return results;
    }


}