package com.esg.core_service.controller;

import com.esg.core_service.dto.GovernanceBenchmarkRequestDto;
import com.esg.core_service.entity.GovernanceBenchmark;
import com.esg.core_service.service.GovernanceBenchmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/governance/benchmark")
@RequiredArgsConstructor
public class GovernanceBenchmarkController {

    private final GovernanceBenchmarkService service;

    @PostMapping
    public ResponseEntity<String> save(
            @RequestHeader("X-Company-Id") UUID companyId,
            @RequestBody GovernanceBenchmarkRequestDto dto) {

        service.save(companyId, dto);
        return ResponseEntity.ok("Governance benchmark saved");
    }

    @GetMapping
    public ResponseEntity<List<GovernanceBenchmark>> getBenchmarks(
            @RequestHeader("X-Company-Id") UUID companyId) {
        return ResponseEntity.ok(service.getBenchmarks(companyId));
    }
}