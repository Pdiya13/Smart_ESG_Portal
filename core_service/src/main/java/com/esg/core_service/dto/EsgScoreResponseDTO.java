package com.esg.core_service.dto;

import lombok.Data;

@Data
public class EsgScoreResponseDTO {
    private Integer reportingYear;
    private Float environmentScore;
    private Float socialScore;
    private Float governanceScore;
    private Float totalEsgScore;
    private String rating;
    private String calculatedAt;
}