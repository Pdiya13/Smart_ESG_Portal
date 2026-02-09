package com.esg.report_service.dto;

import com.esg.report_service.entity.EsgPillar;
import com.esg.report_service.entity.KpiStatus;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter@Setter
public class KpiResultResponseDTO {
    private String kpiName;
    private Float actualValue;
    private Float benchmarkValue;
    private KpiStatus status;
    private EsgPillar pillar;
}
