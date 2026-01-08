package com.esg.core_service.repository;

import com.esg.core_service.entity.Environment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EnvironmentRepository extends JpaRepository<Environment, UUID> {
    Optional<Environment> findByCompanyIdAndReportingYear(
            UUID companyId, Integer reportingYear);
}