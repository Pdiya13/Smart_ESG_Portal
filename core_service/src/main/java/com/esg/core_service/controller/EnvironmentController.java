package com.esg.core_service.controller;

import com.esg.core_service.dto.EnvironmentRequestDto;
import com.esg.core_service.service.EnvironmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class EnvironmentController {

    EnvironmentService environmentService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitEnvironment(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody EnvironmentRequestDto dto) {

        environmentService.submitEnvironmentData(companyId, dto);
        return ResponseEntity.ok("Environment data submitted");
    }
}
