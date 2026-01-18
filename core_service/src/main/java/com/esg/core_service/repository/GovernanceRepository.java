package com.esg.core_service.repository;

import com.esg.core_service.entity.Governance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GovernanceRepository
        extends JpaRepository<Governance, UUID> {
}