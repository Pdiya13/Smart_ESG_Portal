package com.esg.core_service.repository;

import com.esg.core_service.entity.EnvironmentMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EnvironmentMetricRepository extends JpaRepository<EnvironmentMetric, UUID> {
    Optional<EnvironmentMetric> findByCompanyIdAndReportingYear(
            UUID companyId, Integer reportingYear);

    Optional<EnvironmentMetric> findTopByCompanyIdAndReportingYearOrderByCalculatedAtDesc(
            UUID companyId, Integer year);
}