package com.esg.report_service.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class EsgScoreSummaryResponseDTO {
    private UUID companyId;
    private Integer reportingYear;

    private Integer environmentScore;
    private Integer socialScore;
    private Integer governanceScore;

    private Integer totalEsgScore;
}
