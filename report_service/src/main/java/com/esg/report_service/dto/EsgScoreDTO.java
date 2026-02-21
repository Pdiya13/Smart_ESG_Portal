package com.esg.report_service.dto;

import lombok.*;
import org.springframework.stereotype.Service;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EsgScoreDTO {
    private Integer reportingYear;
    private Float environmentScore;
    private Float socialScore;
    private Float governanceScore;
    private Float totalEsgScore;
    private String rating;
    private String calculatedAt;
}