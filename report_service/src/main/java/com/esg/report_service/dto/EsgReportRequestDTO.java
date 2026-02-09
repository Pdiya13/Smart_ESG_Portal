package com.esg.report_service.dto;

import com.esg.report_service.entity.EsgPillar;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EsgReportRequestDTO<T> {
    @NotNull(message = "Reporting year is required")
    @Min(value = 2000, message = "Reporting year must be >= 2000")
    @Max(value = 2100, message = "Reporting year must be <= 2100")
    private Integer reportingYear;

    @NotNull(message = "ESG pillar is required")
    private EsgPillar pillar;

    @NotNull(message = "Metrics payload is required")
    @JsonTypeInfo(
            use = JsonTypeInfo.Id.NAME,
            include = JsonTypeInfo.As.EXTERNAL_PROPERTY,
            property = "pillar"
    )
    @JsonSubTypes({
            @JsonSubTypes.Type(value = EnvironmentMetricInputDTO.class, name = "ENVIRONMENT"),
            @JsonSubTypes.Type(value = SocialMetricInputDTO.class, name = "SOCIAL"),
            @JsonSubTypes.Type(value = GovernanceMetricInputDTO.class, name = "GOVERNANCE")
    })
    private Object metrics;
}
