package com.esg.report_service.controller;

import com.esg.report_service.dto.*;
import com.esg.report_service.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final DashboardService dashboardService;

    // ==============================
    // DASHBOARD VIEW
    // ==============================
    @GetMapping("/dashboard/{year}")
    public ApiResponse<DashboardResponseDTO> getDashboard(
            @RequestHeader("X-Company-Id") UUID companyId,
            @PathVariable Integer year
    ) {
        return ApiResponse.success(
                dashboardService.buildDashboard(companyId, year)
        );
    }
}