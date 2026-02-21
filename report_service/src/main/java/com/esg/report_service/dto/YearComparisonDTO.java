package com.esg.report_service.dto;

import lombok.Data;

@Data
public class YearComparisonDTO {
    private Float environmentScore;
    private Float socialScore;
    private Float governanceScore;
    private Float totalEsgScore;
    private String rating;
}