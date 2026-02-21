package com.esg.core_service.repository;

import com.esg.core_service.entity.ESGScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ESGScoreRepository extends JpaRepository<ESGScore, UUID> {

    Optional<ESGScore> findByCompanyIdAndReportingYear(UUID companyId, Integer year);
    Optional<ESGScore> findTopByCompanyIdAndReportingYearOrderByCalculatedAtDesc(
            UUID companyId, Integer reportingYear);

    @Query("""
    SELECT s FROM ESGScore s
    WHERE s.companyId = :companyId
    AND s.calculatedAt = (
        SELECT MAX(s2.calculatedAt)
        FROM ESGScore s2
        WHERE s2.companyId = s.companyId
        AND s2.reportingYear = s.reportingYear
    )
    ORDER BY s.reportingYear ASC
""")
    List<ESGScore> findLatestScorePerYear(UUID companyId);
}