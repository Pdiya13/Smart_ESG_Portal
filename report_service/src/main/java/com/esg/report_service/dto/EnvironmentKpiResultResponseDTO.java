package com.esg.report_service.dto;

import lombok.Data;

@Data
public class EnvironmentKpiResultResponseDTO {
    private String kpiName;
    private Float actualValue;
    private Float benchmarkValue;
    private String status;
}
