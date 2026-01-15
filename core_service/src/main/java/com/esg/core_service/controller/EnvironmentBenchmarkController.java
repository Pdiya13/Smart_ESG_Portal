package com.esg.core_service.controller;

import com.esg.core_service.dto.EnvironmentBenchmarkRequestDto;
import com.esg.core_service.service.EnvironmentBenchmarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/benchmark/environment")
@RequiredArgsConstructor
public class EnvironmentBenchmarkController {

    private final EnvironmentBenchmarkService service;

    @PostMapping
    public ResponseEntity<String> saveBenchmark(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody EnvironmentBenchmarkRequestDto dto
    ) {
        service.saveBenchmark(companyId, dto);
        return ResponseEntity.ok("Benchmark saved");
    }
}