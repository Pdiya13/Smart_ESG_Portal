package com.esg.core_service.service;

import com.esg.core_service.dto.EsgScoreResponseDTO;
import com.esg.core_service.dto.MetricBreakdownResponseDTO;
import com.esg.core_service.entity.*;
import com.esg.core_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ESGQueryService {

    private final ESGScoreRepository scoreRepository;
    private final EnvironmentMetricRepository envMetricRepo;
    private final SocialMetricRepository socialMetricRepo;
    private final GovernanceMetricRepository govMetricRepo;
    private final ModelMapper mapper;

    // ==============================
    // 1️⃣ Get Score By Year
    // ==============================
    public EsgScoreResponseDTO getScoreByYear(UUID companyId, Integer year) {

        Optional<ESGScore> optionalScore =
                scoreRepository
                        .findTopByCompanyIdAndReportingYearOrderByCalculatedAtDesc(companyId, year);

        if (optionalScore.isEmpty()) {
            return null;
        }

        return mapper.map(optionalScore.get(), EsgScoreResponseDTO.class);
    }

    // ==============================
    // 2️⃣ Get All Scores
    // ==============================
    public List<EsgScoreResponseDTO> getAllScores(UUID companyId) {

        return scoreRepository
                .findLatestScorePerYear(companyId)
                .stream()
                .map(score -> mapper.map(score, EsgScoreResponseDTO.class))
                .collect(Collectors.toList());
    }

    // ==============================
    // 3️⃣ Get KPI Metrics
    // ==============================
    public MetricBreakdownResponseDTO getMetrics(UUID companyId, Integer year) {

        Optional<EnvironmentMetric> env =
                envMetricRepo.findTopByCompanyIdAndReportingYearOrderByCalculatedAtDesc(companyId, year);

        Optional<SocialMetric> soc =
                socialMetricRepo.findTopByCompanyIdAndReportingYearOrderByCalculatedAtDesc(companyId, year);

        Optional<GovernanceMetric> gov =
                govMetricRepo.findTopByCompanyIdAndReportingYearOrderByCalculatedAtDesc(companyId, year);

        if (env.isEmpty() || soc.isEmpty() || gov.isEmpty()) {
            return null;
        }

        MetricBreakdownResponseDTO dto = new MetricBreakdownResponseDTO();
        dto.setEnvironmentMetrics(env.get());
        dto.setSocialMetrics(soc.get());
        dto.setGovernanceMetrics(gov.get());

        return dto;
    }
}