package com.esg.core_service.service;

import com.esg.core_service.dto.SocialRequestDto;
import com.esg.core_service.entity.Social;
import com.esg.core_service.entity.SocialBenchmark;
import com.esg.core_service.entity.SocialMetric;
import com.esg.core_service.repository.SocialBenchmarkRepository;
import com.esg.core_service.repository.SocialMetricRepository;
import com.esg.core_service.repository.SocialRepository;
import com.esg.core_service.util.SocialFormulaUtil;
import com.esg.core_service.util.SocialScoreEngine;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final SocialRepository socialRepository;
    private final SocialMetricRepository metricRepository;
    private final SocialBenchmarkRepository benchmarkRepository;
    private final ModelMapper mapper;

    @CacheEvict(value = {"social_report", "esg_metrics", "esg_scores", "all_esg_scores"}, allEntries = true)
    public float submit(UUID companyId, SocialRequestDto dto) {

        Social s = mapper.map(dto, Social.class);
        s.setCompanyId(companyId);
        s.setCreatedAt(LocalDateTime.now());
        Social saved = socialRepository.save(s);

        SocialMetric metric = SocialFormulaUtil.calculateAll(saved);
        metricRepository.save(metric);

        List<String> kpis = List.of(
                "WOMEN_WORKFORCE", "WOMEN_LEADERSHIP", "ATTRITION",
                "TRAINING", "SATISFACTION", "INSURANCE", "LTIFR", "MENTAL_HEALTH"
        );
        List<SocialBenchmark> active = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String kpi : kpis) {
            SocialBenchmark b = benchmarkRepository.findLatest(companyId, kpi);
            if (b == null) {
                missing.add(kpi);
            } else {
                active.add(b);
            }
        }

        if (!missing.isEmpty()) {
            throw new IllegalArgumentException("Missing Social benchmarks: " + String.join(", ", missing));
        }

        return SocialScoreEngine.calculateScore(metric, active);
    }

    @Cacheable(value = "social_report", key = "#companyId + '_' + #year")
    public SocialRequestDto getReportData(UUID companyId, Integer year) {

        System.out.println("CompanyId received: " + companyId);
        System.out.println("Year received: " + year);

        Social entity = socialRepository
                .findTopByCompanyIdAndReportingYearOrderByCreatedAtDesc(companyId, year)
                .orElseThrow(() ->
                        new RuntimeException("Social data not found"));

        return mapper.map(entity, SocialRequestDto.class);
    }
}