package com.example.DeviceSimulator;

import com.example.DeviceSimulator.service.DeviceSimulatorService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Collections;

@SpringBootApplication
public class DeviceSimulatorApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(DeviceSimulatorApplication.class);
		if (args.length > 0) {
			app.setDefaultProperties(Collections.singletonMap("spring.config.name", args[0]));
		}
		app.run(args);
	}

	@Bean
	CommandLineRunner run(DeviceSimulatorService simulatorService) {
		return args -> {
			simulatorService.runSimulator();
		};
	}
}
