package com.esg.report_service.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class EnvironmentReportResponseDTO {
    private UUID reportId;
    private UUID companyId;
    private Integer reportingYear;

    private Integer environmentScore;
    private Integer totalEsgScore;

    private LocalDateTime generatedAt;

    private List<EnvironmentKpiResultResponseDTO> kpiResults;
}
