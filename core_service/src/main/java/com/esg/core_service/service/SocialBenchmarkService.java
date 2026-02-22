package com.esg.core_service.service;

import com.esg.core_service.dto.SocialBenchmarkRequestDto;
import com.esg.core_service.entity.SocialBenchmark;
import com.esg.core_service.repository.SocialBenchmarkRepository;
import com.esg.core_service.util.SocialBenchmarkRules;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocialBenchmarkService {

    private final SocialBenchmarkRepository repository;
    private final ModelMapper mapper;

    public void save(UUID companyId, SocialBenchmarkRequestDto dto) {

        SocialBenchmarkRules.validate(dto.getKpiName(), dto.getBenchmarkValue());

        SocialBenchmark b = mapper.map(dto, SocialBenchmark.class);
        b.setCompanyId(companyId);
        b.setComparisonType(SocialBenchmarkRules.getComparison(dto.getKpiName()));
        b.setCreatedAt(LocalDateTime.now());

        repository.save(b);
    }

    public List<SocialBenchmark> getBenchmarks(UUID companyId) {
        return repository.findByCompanyId(companyId);
    }
}