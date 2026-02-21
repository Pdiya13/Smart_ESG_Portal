package com.esg.core_service.dto;

import lombok.Data;

@Data
public class MetricBreakdownResponseDTO {

    private Object environmentMetrics;
    private Object socialMetrics;
    private Object governanceMetrics;
}