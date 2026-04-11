package com.esg.report_service.service;

import com.esg.report_service.client.CoreServiceClient;
import com.esg.report_service.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ReportAggregatorService aggregator;

    public DashboardResponseDTO buildDashboard(UUID companyId, Integer year) {
        return aggregator.build(companyId, year);
    }
}