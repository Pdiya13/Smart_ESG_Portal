package com.esg.report_service.repository;

import com.esg.report_service.entity.AnnualReportSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AnnualReportSnapshotRepository
        extends JpaRepository<AnnualReportSnapshot, UUID> {

    List<AnnualReportSnapshot>
    findByCompanyIdOrderByReportingYearAsc(UUID companyId);
}