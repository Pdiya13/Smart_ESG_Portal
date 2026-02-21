package com.esg.core_service.repository;

import com.esg.core_service.entity.GovernanceMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GovernanceMetricRepository
        extends JpaRepository<GovernanceMetric, UUID> {
    Optional<GovernanceMetric>
    findTopByCompanyIdAndReportingYearOrderByCalculatedAtDesc(
            UUID companyId,
            Integer reportingYear
    );
}