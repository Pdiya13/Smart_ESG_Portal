package com.esg.core_service.repository;

import com.esg.core_service.entity.EnvironmentBenchmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface EnvironmentBenchmarkRepository
        extends JpaRepository<EnvironmentBenchmark, UUID> {

    // Fetch all versions sorted by time (newest first)
    @Query("""
        SELECT b FROM EnvironmentBenchmark b
        WHERE b.companyId = :companyId
        AND b.kpiName = :kpiName
        ORDER BY b.createdAt DESC
    """)
    List<EnvironmentBenchmark> findAllSorted(UUID companyId, String kpiName);

    // Always return latest benchmark
    default EnvironmentBenchmark findLatest(UUID companyId, String kpiName) {
        return findAllSorted(companyId, kpiName)
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("No benchmark found for " + kpiName));
    }

    List<EnvironmentBenchmark> findByCompanyId(UUID companyId);
}