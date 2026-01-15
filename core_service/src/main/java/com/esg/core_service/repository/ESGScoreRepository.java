package com.esg.core_service.repository;

import com.esg.core_service.entity.ESGScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ESGScoreRepository extends JpaRepository<ESGScore, UUID> {

    Optional<ESGScore> findByCompanyIdAndReportingYear(UUID companyId, Integer year);
}