package com.esg.core_service.controller;

import com.esg.core_service.dto.EnvironmentRequestDto;
import com.esg.core_service.service.EnvironmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/environment/submit")
@RequiredArgsConstructor
public class EnvironmentController {

    private final EnvironmentService environmentService;

    @PostMapping
    public ResponseEntity<String> submitEnvironment(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody EnvironmentRequestDto dto
    ) {
        environmentService.submit(companyId, dto);
        return ResponseEntity.ok("Environment data submitted");
    }

    @GetMapping("/report-data")
    public ResponseEntity<EnvironmentRequestDto> getEnvironmentReportData(
            @RequestHeader("X-Company-Id") UUID companyId,
            @RequestParam Integer reportingYear
    ) {
        return ResponseEntity.ok(
                environmentService.getReportData(companyId, reportingYear)
        );
    }

}