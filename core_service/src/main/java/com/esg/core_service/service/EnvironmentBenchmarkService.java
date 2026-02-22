package com.esg.core_service.service;

import com.esg.core_service.dto.EnvironmentBenchmarkRequestDto;
import com.esg.core_service.entity.EnvironmentBenchmark;
import com.esg.core_service.repository.EnvironmentBenchmarkRepository;
import com.esg.core_service.util.EnvironmentBenchmarkRules;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnvironmentBenchmarkService {

    private final EnvironmentBenchmarkRepository repository;
    private final ModelMapper mapper;

    public void saveBenchmark(UUID companyId, EnvironmentBenchmarkRequestDto dto) {

        EnvironmentBenchmarkRules.validateBenchmark(
                dto.getKpiName(), dto.getBenchmarkValue()
        );

        EnvironmentBenchmark benchmark =
                mapper.map(dto, EnvironmentBenchmark.class);

        benchmark.setCompanyId(companyId);
        benchmark.setComparisonType(
                EnvironmentBenchmarkRules.getComparisonType(dto.getKpiName())
        );
        benchmark.setCreatedAt(LocalDateTime.now());

        repository.save(benchmark);
    }

    public List<EnvironmentBenchmark> getBenchmarks(UUID companyId) {
        return repository.findByCompanyId(companyId);
    }
}