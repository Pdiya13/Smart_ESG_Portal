package com.esg.core_service.controller;

import com.esg.core_service.dto.SocialRequestDto;
import com.esg.core_service.service.SocialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/social/submit")
@RequiredArgsConstructor
public class SocialController {

    private final SocialService service;

    @PostMapping
    public ResponseEntity<String> submit(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody SocialRequestDto dto) {

        service.submit(companyId, dto);
        return ResponseEntity.ok("Social data submitted");
    }

    @GetMapping("/report-data")
    public ResponseEntity<SocialRequestDto> getSocialReportData(
            @RequestHeader("X-Company-Id") UUID companyId,
            @RequestParam Integer reportingYear
    ) {
        return ResponseEntity.ok(
                service.getReportData(companyId, reportingYear)
        );
    }
}