package com.esg.report_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardResponseDTO {

    private EsgScoreDTO score;
    private MetricBreakdownDTO metrics;
    private List<TrendDTO> trends;
    private List<RecommendationDTO> recommendations;
    private List<EsgScoreDTO> history;
}