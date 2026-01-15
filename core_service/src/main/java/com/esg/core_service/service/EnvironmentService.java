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

        List<EnvironmentBenchmark> active = List.of(
                benchmarkRepository.findLatest(companyId,"EUI"),
                benchmarkRepository.findLatest(companyId,"RENEWABLE_PERCENT"),
                benchmarkRepository.findLatest(companyId,"PUE"),
                benchmarkRepository.findLatest(companyId,"WATER_PER_EMP"),
                benchmarkRepository.findLatest(companyId,"EWASTE_RECYCLE"),
                benchmarkRepository.findLatest(companyId,"CARBON_INTENSITY")
        );

        return EnvironmentScoreEngine.calculateScore(metric, active);
    }
}