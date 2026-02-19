package com.esg.core_service.repository;

import com.esg.core_service.entity.Governance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.Optional;

public interface GovernanceRepository
        extends JpaRepository<Governance, UUID> {
    Optional<Governance> findTopByCompanyIdAndReportingYearOrderByCreatedAtDesc(UUID companyId, Integer reportingYear);
}