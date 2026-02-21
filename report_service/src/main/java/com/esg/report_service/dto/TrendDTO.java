package com.esg.report_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrendDTO {

    private Integer previousYear;
    private Integer currentYear;
    private String direction;       // UP / DOWN / STABLE
    private Float growthPercent;
}