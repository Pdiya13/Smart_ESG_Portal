package com.esg.core_service.repository;

import com.esg.core_service.entity.Social;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SocialRepository extends JpaRepository<Social, UUID> {
    Optional<Social> findTopByCompanyIdAndReportingYearOrderByCreatedAtDesc(UUID companyId, Integer reportingYear);
}