package com.esg.core_service.repository;

import com.esg.core_service.entity.GovernanceBenchmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface GovernanceBenchmarkRepository
        extends JpaRepository<GovernanceBenchmark, UUID> {

    @Query("""
        SELECT b FROM GovernanceBenchmark b
        WHERE b.companyId = :companyId
          AND b.kpiName = :kpiName
        ORDER BY b.createdAt DESC
    """)
    List<GovernanceBenchmark> findAllSorted(UUID companyId, String kpiName);

    // Always return latest benchmark
    default GovernanceBenchmark findLatest(UUID companyId, String kpiName) {
        return findAllSorted(companyId, kpiName)
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("No benchmark for " + kpiName));
    }

    List<GovernanceBenchmark> findByCompanyId(UUID companyId);
}