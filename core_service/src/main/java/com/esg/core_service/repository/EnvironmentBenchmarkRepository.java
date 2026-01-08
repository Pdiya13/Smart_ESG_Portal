package com.esg.core_service.repository;

import com.esg.core_service.entity.EnvironmentBenchmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EnvironmentBenchmarkRepository extends JpaRepository<EnvironmentBenchmark, Integer> {
    Optional<EnvironmentBenchmark> findByCompanyIdAndKpiName(
            UUID companyId, String kpiName);
}