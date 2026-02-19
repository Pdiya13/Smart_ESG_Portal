package com.esg.report_service.dto;

import com.esg.report_service.entity.EsgPillar;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EsgReportRequestDTO {

    @NotNull(message = "Reporting year is required")
    @Min(value = 2000, message = "Reporting year must be >= 2000")
    @Max(value = 2100, message = "Reporting year must be <= 2100")
    private Integer reportingYear;

    @NotNull(message = "ESG pillar is required")
    private EsgPillar pillar;
}