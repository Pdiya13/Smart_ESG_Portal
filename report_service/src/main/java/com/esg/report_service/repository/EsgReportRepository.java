package com.esg.report_service.repository;

import com.esg.report_service.entity.EsgReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EsgReportRepository extends JpaRepository<EsgReport, UUID> {
}