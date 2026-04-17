package com.esg.core_service.service;

import com.esg.core_service.dto.GovernanceBenchmarkRequestDto;
import com.esg.core_service.entity.GovernanceBenchmark;
import com.esg.core_service.repository.GovernanceBenchmarkRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GovernanceBenchmarkService {

    private final GovernanceBenchmarkRepository repository;
    private final BenchmarkStandardService standardService;
    private final ModelMapper mapper;

    public void save(UUID companyId, GovernanceBenchmarkRequestDto dto) {

        standardService.validate(dto.getKpiName(), dto.getBenchmarkValue());

        GovernanceBenchmark b =
                mapper.map(dto, GovernanceBenchmark.class);

        b.setCompanyId(companyId);
        b.setComparisonType(
                standardService.getComparisonType(dto.getKpiName())
        );
        b.setCreatedAt(Instant.now());

        repository.save(b);
    }

    public List<GovernanceBenchmark> getBenchmarks(UUID companyId) {
        return repository.findByCompanyId(companyId);
    }
}