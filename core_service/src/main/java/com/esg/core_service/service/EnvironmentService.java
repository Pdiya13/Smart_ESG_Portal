package com.esg.core_service.service;

import com.esg.core_service.dto.EnvironmentRequestDto;
import com.esg.core_service.entity.Environment;
import com.esg.core_service.entity.EnvironmentBenchmark;
import com.esg.core_service.entity.EnvironmentMetric;
import com.esg.core_service.repository.EnvironmentBenchmarkRepository;
import com.esg.core_service.repository.EnvironmentMetricRepository;
import com.esg.core_service.repository.EnvironmentRepository;
import com.esg.core_service.util.EnvironmentFormulaUtil;
import com.esg.core_service.util.EnvironmentScoreEngine;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnvironmentService {

    private final EnvironmentRepository environmentRepository;
    private final EnvironmentMetricRepository metricRepository;
    private final EnvironmentBenchmarkRepository benchmarkRepository;
    private final ModelMapper modelMapper;

    public float submit(UUID companyId, EnvironmentRequestDto dto) {

        Environment env = modelMapper.map(dto, Environment.class);
        env.setCompanyId(companyId);
        env.setCreatedAt(LocalDateTime.now());
        Environment saved = environmentRepository.save(env);

        EnvironmentMetric metric = EnvironmentFormulaUtil.calculateAll(saved);
        metricRepository.save(metric);

        List<String> kpis = List.of("EUI", "RENEWABLE_PERCENT", "PUE", "WATER_PER_EMP", "EWASTE_RECYCLE", "CARBON_INTENSITY");
        List<EnvironmentBenchmark> active = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String kpi : kpis) {
            EnvironmentBenchmark b = benchmarkRepository.findLatest(companyId, kpi);
            if (b == null) {
                missing.add(kpi);
            } else {
                active.add(b);
            }
        }

        if (!missing.isEmpty()) {
            throw new IllegalArgumentException("Missing Environment benchmarks: " + String.join(", ", missing));
        }

        return EnvironmentScoreEngine.calculateScore(metric, active);
    }

    public EnvironmentRequestDto getReportData(UUID companyId, Integer year) {

        System.out.println("CompanyId received: " + companyId);
        System.out.println("Year received: " + year);

        Environment entity = environmentRepository
                .findTopByCompanyIdAndReportingYearOrderByCreatedAtDesc(companyId, year)
                .orElseThrow(() ->
                        new RuntimeException("Environment data not found"));

        return modelMapper.map(entity, EnvironmentRequestDto.class);
    }
}