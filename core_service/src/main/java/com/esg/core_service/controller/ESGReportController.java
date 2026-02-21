package com.esg.core_service.controller;

import com.esg.core_service.dto.EsgScoreResponseDTO;
import com.esg.core_service.dto.MetricBreakdownResponseDTO;
import com.esg.core_service.service.ESGQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
public class ESGReportController {

    private final ESGQueryService queryService;

    // ==============================
    // 1️⃣ Get ESG Score By Year
    // ==============================
    @GetMapping("/esg-score/{year}")
    public ResponseEntity<?> getScore(
            @RequestHeader("X-Company-Id") UUID companyId,
            @PathVariable Integer year
    ) {

        EsgScoreResponseDTO score =
                queryService.getScoreByYear(companyId, year);

        if (score == null) {
            return ResponseEntity
                    .status(404)
                    .body("No ESG score found for year " + year);
        }

        return ResponseEntity.ok(score);
    }

    // ==============================
    // 2️⃣ Get All ESG Scores
    // ==============================
    @GetMapping("/esg-score/all")
    public ResponseEntity<List<EsgScoreResponseDTO>> getAllScores(
            @RequestHeader("X-Company-Id") UUID companyId
    ) {
        return ResponseEntity.ok(queryService.getAllScores(companyId));
    }

    // ==============================
    // 3️⃣ Get KPI Metrics By Year
    // ==============================
    @GetMapping("/metrics/{year}")
    public ResponseEntity<?> getMetrics(
            @RequestHeader("X-Company-Id") UUID companyId,
            @PathVariable Integer year
    ) {

        MetricBreakdownResponseDTO metrics =
                queryService.getMetrics(companyId, year);

        if (metrics == null) {
            return ResponseEntity
                    .status(404)
                    .body("Metrics not found for year " + year);
        }

        return ResponseEntity.ok(metrics);
    }
}