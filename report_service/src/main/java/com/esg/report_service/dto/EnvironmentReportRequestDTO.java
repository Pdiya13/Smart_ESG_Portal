package com.esg.report_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EnvironmentReportRequestDTO {
    @NotNull
    private Integer reportingYear;

    @Valid
    @NotNull
    private EnvironmentMetricInputDTO metrics;
}
