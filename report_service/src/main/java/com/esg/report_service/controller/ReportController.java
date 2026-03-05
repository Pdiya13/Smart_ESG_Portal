package com.esg.report_service.controller;

import com.esg.report_service.dto.*;
import com.esg.report_service.service.DashboardService;
import com.esg.report_service.service.PdfReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final DashboardService dashboardService;
    private final PdfReportService pdfReportService;

    // ==============================
    // DASHBOARD VIEW
    // ==============================
    @GetMapping("/dashboard/{year}")
    public ApiResponse<DashboardResponseDTO> getDashboard(
            @RequestHeader("X-Company-Id") UUID companyId,
            @PathVariable Integer year) {
        return ApiResponse.success(
                dashboardService.buildDashboard(companyId, year));
    }

    @GetMapping("/dashboard/{year}/download")
    public ResponseEntity<byte[]> downloadPdf(
            @RequestHeader("X-Company-Id") UUID companyId,
            @PathVariable Integer year) {
        DashboardResponseDTO dashboard = dashboardService.buildDashboard(companyId, year);
        byte[] pdfBytes = pdfReportService.generatePdf(dashboard);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ESG_Report_" + year + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}