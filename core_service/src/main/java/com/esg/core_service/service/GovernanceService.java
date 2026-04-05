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
import java.util.ArrayList;
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

        List<String> kpis = List.of(
                "BOARD_INDEPENDENCE", "FEMALE_DIRECTORS", "BOARD_MEETINGS",
                "ATTENDANCE", "DATA_PRIVACY", "ISO_27001", "CYBER_INCIDENTS",
                "WHISTLEBLOWER_RESOLUTION", "ANTI_CORRUPTION"
        );
        List<GovernanceBenchmark> active = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String kpi : kpis) {
            GovernanceBenchmark b = benchmarkRepo.findLatest(companyId, kpi);
            if (b == null) {
                missing.add(kpi);
            } else {
                active.add(b);
            }
        }

        if (!missing.isEmpty()) {
            throw new IllegalArgumentException("Missing Governance benchmarks: " + String.join(", ", missing));
        }

        return GovernanceScoreEngine.calculateScore(metric, active);
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
