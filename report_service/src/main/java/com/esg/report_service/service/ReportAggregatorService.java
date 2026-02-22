package com.esg.report_service.service;

import com.esg.report_service.client.CoreServiceClient;
import com.esg.report_service.dto.*;
import com.esg.report_service.entity.AnnualReportSnapshot;
import com.esg.report_service.exception.ResourceNotFoundException;
import com.esg.report_service.repository.AnnualReportSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportAggregatorService {

    private final CoreServiceClient coreClient;
    private final TrendAnalysisService trendService;
    private final RecommendationService recommendationService;
    private final AnnualReportSnapshotRepository snapshotRepo;

    public DashboardResponseDTO build(UUID companyId, Integer year) {

        EsgScoreDTO score =
                coreClient.getEsgScore(companyId, year).block();

        if (score == null) {
            throw new ResourceNotFoundException("No ESG data found for year " + year);
        }

        MetricBreakdownDTO metrics =
                coreClient.getMetrics(companyId, year).block();

        List<EsgScoreDTO> allScores =
                coreClient.getAllEsgScores(companyId).block();

        if (allScores == null) {
            allScores = Collections.emptyList();
        }

        List<TrendDTO> trends =
                trendService.calculateTrends(allScores);

        List<RecommendationDTO> recommendations =
                recommendationService.generate(score);

        saveSnapshot(companyId, score);

        DashboardResponseDTO dto = new DashboardResponseDTO();
        dto.setScore(score);
        dto.setMetrics(metrics);
        dto.setTrends(trends);
        dto.setRecommendations(recommendations);
        dto.setHistory(allScores);

        return dto;
    }

    private void saveSnapshot(UUID companyId, EsgScoreDTO score) {

        AnnualReportSnapshot snapshot =
                AnnualReportSnapshot.builder()
                        .companyId(companyId)
                        .reportingYear(score.getReportingYear())
                        .environmentScore(score.getEnvironmentScore())
                        .socialScore(score.getSocialScore())
                        .governanceScore(score.getGovernanceScore())
                        .totalEsgScore(score.getTotalEsgScore())
                        .rating(score.getRating())
                        .generatedAt(LocalDateTime.now())
                        .build();

        snapshotRepo.save(snapshot);
    }
}