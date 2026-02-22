package com.esg.core_service.controller;

import com.esg.core_service.dto.SocialBenchmarkRequestDto;
import com.esg.core_service.entity.SocialBenchmark;
import com.esg.core_service.service.SocialBenchmarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/social/benchmark")
@RequiredArgsConstructor
public class SocialBenchmarkController {

    private final SocialBenchmarkService service;

    @PostMapping
    public ResponseEntity<String> save(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody SocialBenchmarkRequestDto dto) {

        service.save(companyId, dto);
        return ResponseEntity.ok("Social benchmark saved");
    }

    @GetMapping
    public ResponseEntity<List<SocialBenchmark>> getBenchmarks(
            @RequestHeader("X-Company-Id") UUID companyId) {
        return ResponseEntity.ok(service.getBenchmarks(companyId));
    }
}