package com.esg.core_service.repository;

import com.esg.core_service.entity.SocialBenchmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SocialBenchmarkRepository
        extends JpaRepository<SocialBenchmark, UUID> {

    @Query("""
        SELECT b FROM SocialBenchmark b
        WHERE b.companyId = :companyId
        AND b.kpiName = :kpiName
        ORDER BY b.createdAt DESC
    """)
    List<SocialBenchmark> findAllSorted(UUID companyId, String kpiName);

    default SocialBenchmark findLatest(UUID companyId, String kpiName) {
        return findAllSorted(companyId, kpiName)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No benchmark for " + kpiName));
    }
}