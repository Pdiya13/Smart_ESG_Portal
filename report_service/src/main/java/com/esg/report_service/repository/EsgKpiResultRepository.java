package com.esg.report_service.repository;

import com.esg.report_service.entity.EsgKpiResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EsgKpiResultRepository extends JpaRepository<EsgKpiResult, UUID> {
}