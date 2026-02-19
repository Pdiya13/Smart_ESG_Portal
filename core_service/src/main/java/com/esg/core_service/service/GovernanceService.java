package com.esg.core_service.service;

import com.esg.core_service.dto.GovernanceRequestDto;
import com.esg.core_service.entity.Governance;
import com.esg.core_service.entity.GovernanceBenchmark;
import com.esg.core_service.entity.GovernanceMetric;
import com.esg.core_service.repository.GovernanceBenchmarkRepository;
import com.esg.core_service.repository.GovernanceMetricRepository;
import com.esg.core_service.repository.GovernanceRepository;
import com.esg.core_service.util.GovernanceFormulaUtil;
import com.esg.core_service.util.GovernanceScoreEngine;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GovernanceService {

    private final GovernanceRepository repo;
    private final GovernanceMetricRepository metricRepo;
    private final GovernanceBenchmarkRepository benchmarkRepo;
    private final ModelMapper mapper;

    public float submit(UUID companyId, GovernanceRequestDto dto) {

        Governance g = mapper.map(dto, Governance.class);
        g.setCompanyId(companyId);
        g.setCreatedAt(Instant.now());

        Governance saved = repo.save(g);

        GovernanceMetric metric =
                GovernanceFormulaUtil.calculateAll(saved);

        metricRepo.save(metric);

        List<GovernanceBenchmark> benchmarks = List.of(
                benchmarkRepo.findLatest(companyId, "BOARD_INDEPENDENCE"),
                benchmarkRepo.findLatest(companyId, "FEMALE_DIRECTORS"),
                benchmarkRepo.findLatest(companyId, "BOARD_MEETINGS"),
                benchmarkRepo.findLatest(companyId, "ATTENDANCE"),
                benchmarkRepo.findLatest(companyId, "DATA_PRIVACY"),
                benchmarkRepo.findLatest(companyId, "ISO_27001"),
                benchmarkRepo.findLatest(companyId, "CYBER_INCIDENTS"),
                benchmarkRepo.findLatest(companyId, "WHISTLEBLOWER_RESOLUTION"),
                benchmarkRepo.findLatest(companyId, "ANTI_CORRUPTION")
        );

        return GovernanceScoreEngine.calculateScore(metric, benchmarks);
    }

    public GovernanceRequestDto getReportData(UUID companyId, Integer year) {

        System.out.println("CompanyId received: " + companyId);
        System.out.println("Year received: " + year);

        Governance entity = repo
                .findTopByCompanyIdAndReportingYearOrderByCreatedAtDesc(companyId, year)
                .orElseThrow(() ->
                        new RuntimeException("Governance data not found"));

        return mapper.map(entity, GovernanceRequestDto.class);
    }
}
