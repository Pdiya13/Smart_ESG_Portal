package com.esg.core_service.repository;

import com.esg.core_service.entity.BenchmarkStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BenchmarkStandardRepository extends JpaRepository<BenchmarkStandard, UUID> {
    Optional<BenchmarkStandard> findByKpiName(String kpiName);
}
