package com.esg.report_service.dto;

import lombok.Data;

@Data
public class MetricBreakdownDTO {

    private Object environmentMetrics;
    private Object socialMetrics;
    private Object governanceMetrics;
}