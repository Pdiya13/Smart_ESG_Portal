package com.esg.core_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GovernanceBenchmarkRequestDto {

    @NotBlank(message = "KPI name is required")
    private String kpiName;

    @NotNull(message = "Benchmark value is required")
    private Float benchmarkValue;
}