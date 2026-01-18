package com.esg.core_service.repository;

import com.esg.core_service.entity.GovernanceMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GovernanceMetricRepository
        extends JpaRepository<GovernanceMetric, UUID> {
}