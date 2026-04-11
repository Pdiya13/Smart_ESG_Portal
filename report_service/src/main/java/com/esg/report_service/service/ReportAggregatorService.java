package com.esg.report_service.service;

import com.esg.report_service.client.CoreServiceClient;
import com.esg.report_service.dto.*;
import com.esg.report_service.entity.AnnualReportSnapshot;
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

        // 1. Fetch available scores for the company first
        List<EsgScoreDTO> allScores =
                coreClient.getAllEsgScores(companyId).block();

        if (allScores == null) {
            allScores = Collections.emptyList();
        }

        // 2. Try to fetch the score for the requested year
        EsgScoreDTO score =
                coreClient.getEsgScore(companyId, year).block();

        // 3. Initialize the response DTO
        DashboardResponseDTO dto = new DashboardResponseDTO();
        dto.setHistory(allScores);

        // 4. If the requested year has data, populate the full dashboard
        if (score != null) {
            MetricBreakdownDTO metrics =
                    coreClient.getMetrics(companyId, year).block();

            List<TrendDTO> trends =
                    trendService.calculateTrends(allScores);

            List<RecommendationDTO> recommendations =
                    recommendationService.generate(score);

            saveSnapshot(companyId, score);

            dto.setScore(score);
            dto.setMetrics(metrics);
            dto.setTrends(trends);
            dto.setRecommendations(recommendations);
        }

        return dto;
    }

    private void saveSnapshot(UUID companyId, EsgScoreDTO score) {

        AnnualReportSnapshot existing = snapshotRepo.findTopByCompanyIdAndReportingYearOrderByGeneratedAtDesc(companyId, score.getReportingYear());

        if (existing != null) {
            existing.setEnvironmentScore(score.getEnvironmentScore());
            existing.setSocialScore(score.getSocialScore());
            existing.setGovernanceScore(score.getGovernanceScore());
            existing.setTotalEsgScore(score.getTotalEsgScore());
            existing.setRating(score.getRating());
            existing.setGeneratedAt(LocalDateTime.now());
            snapshotRepo.save(existing);
        } else {
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
}