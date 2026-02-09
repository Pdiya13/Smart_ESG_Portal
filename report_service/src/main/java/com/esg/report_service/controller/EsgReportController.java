package com.esg.report_service.controller;

import com.esg.report_service.dto.*;
import com.esg.report_service.service.EsgReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reports/generate")
@RequiredArgsConstructor
public class EsgReportController {
    private final EsgReportService esgReportService;

    @PostMapping
    public ResponseEntity<ApiResponse<EsgReportResponseDTO>> generateReport(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody EsgReportRequestDTO request
    ) {
        return ResponseEntity.ok(
                esgReportService.generateReport(companyId, request)
        );
    }

    @PostMapping("/score-summary")
    public ResponseEntity<ApiResponse<EsgScoreSummaryResponseDTO>> getScoreSummary(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody EsgScoreSummaryRequestDTO request
    ) {
        return ResponseEntity.ok(esgReportService.getEsgScoreSummary(companyId, request.getReportingYear()));
    }
}
