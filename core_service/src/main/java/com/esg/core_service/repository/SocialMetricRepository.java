package com.esg.core_service.repository;

import com.esg.core_service.entity.SocialMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SocialMetricRepository extends JpaRepository<SocialMetric, UUID> {
    Optional<SocialMetric> findTopByCompanyIdAndReportingYearOrderByCalculatedAtDesc(
            UUID companyId,
            Integer reportingYear
    );
}