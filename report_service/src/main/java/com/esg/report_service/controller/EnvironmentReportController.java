package com.esg.report_service.controller;

import com.esg.report_service.dto.EnvironmentReportRequestDTO;
import com.esg.report_service.dto.EnvironmentReportResponseDTO;
import com.esg.report_service.entity.EsgReport;
import com.esg.report_service.service.EnvironmentReportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/report/environment")
@RequiredArgsConstructor
public class EnvironmentReportController {

    private final EnvironmentReportService reportService;
    private final ModelMapper modelMapper;

    @PostMapping("/generate")
    public ResponseEntity<EnvironmentReportResponseDTO> generateEnvironmentReport(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody EnvironmentReportRequestDTO request) {

        return ResponseEntity.ok(reportService.generateEnvironmentReport(companyId, request));
    }
}
