package com.esg.core_service.service;

import com.esg.core_service.dto.EnvironmentRequestDto;
import com.esg.core_service.entity.Environment;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnvironmentService {

    private final EnvironmentRepository environmentRepository;
    private final EnvironmentMetricRepository metricRepository;
    private final EnvironmentBenchmarkRepository benchmarkRepository;
    private final ModelMapper modelMapper;

    public void submitEnvironmentData(UUID companyId, @Valid EnvironmentRequestDto dto) {

        Environment env = modelMapper.map(dto, Environment.class);
        env.setCompanyId(companyId);
        env.setCreatedAt(LocalDateTime.now());

        Environment savedEnv = environmentRepository.save(env);

        EnvironmentMetric metric = EnvironmentFormulaUtil.calculateAll(savedEnv);

        metricRepository.save(metric);

        var benchmarks = benchmarkRepository.findByCompanyId(companyId);

        float envScore = EnvironmentScoreEngine.calculateScore(metric, benchmarks);

        System.out.println("Environment Score = " + envScore);
    }
}