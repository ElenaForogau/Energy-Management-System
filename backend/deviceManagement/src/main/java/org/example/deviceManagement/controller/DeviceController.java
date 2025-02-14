package org.example.deviceManagement.controller;

import lombok.RequiredArgsConstructor;
import org.example.deviceManagement.model.Device;
import org.example.deviceManagement.service.IDeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DeviceController {

    private final IDeviceService deviceService;

    @PostMapping("/create")
    public ResponseEntity<?> createDevice(@RequestBody Device device) {
        if (device.getUserId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is required");
        }
        try {
            Device newDevice = deviceService.createDevice(device);
            return ResponseEntity.status(HttpStatus.CREATED).body(newDevice);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating device: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Device>> getAllDevices() {
        List<Device> devices = deviceService.getAllDevices();
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable("id") Long id) {
        try {
            Device device = deviceService.getDeviceById(id);
            return ResponseEntity.ok(device);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDevice(@PathVariable("id") Long id, @RequestBody Device updatedDevice) {
        try {
            Device device = deviceService.updateDevice(id, updatedDevice);
            return ResponseEntity.ok(device);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating device: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDevice(@PathVariable("id") Long id) {
        try {
            deviceService.deleteDevice(id);
            return ResponseEntity.ok("Device deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting device: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Device>> getDevicesForUser(@PathVariable Long userId) {
        try {
            List<Device> devices = deviceService.getDevicesByUserId(userId);
            return new ResponseEntity<>(devices, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> deleteDevicesByUserId(@PathVariable Long userId) {
        try {
            System.out.println("AM PRIMIT APEL DE LA USER: " + userId);
            deviceService.deleteDevicesByUserId(userId);
            return ResponseEntity.ok("Devices deleted successfully for user ID: " + userId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting devices: " + e.getMessage());
        }
    }

}
