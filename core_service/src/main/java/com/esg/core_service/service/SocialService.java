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

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final SocialRepository socialRepository;
    private final SocialMetricRepository metricRepository;
    private final SocialBenchmarkRepository benchmarkRepository;
    private final ModelMapper mapper;

    public float submit(UUID companyId, SocialRequestDto dto) {

        Social s = mapper.map(dto, Social.class);
        s.setCompanyId(companyId);
        s.setCreatedAt(LocalDateTime.now());
        Social saved = socialRepository.save(s);

        SocialMetric metric = SocialFormulaUtil.calculateAll(saved);
        metricRepository.save(metric);

        List<SocialBenchmark> active = List.of(
                benchmarkRepository.findLatest(companyId,"WOMEN_WORKFORCE"),
                benchmarkRepository.findLatest(companyId,"WOMEN_LEADERSHIP"),
                benchmarkRepository.findLatest(companyId,"ATTRITION"),
                benchmarkRepository.findLatest(companyId,"TRAINING"),
                benchmarkRepository.findLatest(companyId,"SATISFACTION"),
                benchmarkRepository.findLatest(companyId,"INSURANCE"),
                benchmarkRepository.findLatest(companyId,"LTIFR"),
                benchmarkRepository.findLatest(companyId,"MENTAL_HEALTH")
        );

        return SocialScoreEngine.calculateScore(metric, active);
    }
}