package com.esg.report_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EsgScoreSummaryRequestDTO {
    @NotNull(message = "Reporting year is required")
    @Min(value = 2000, message = "Reporting year must be >= 2000")
    @Max(value = 2100, message = "Reporting year must be <= 2100")
    private Integer reportingYear;
}
