package com.esg.core_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EnvironmentBenchmarkRequestDto {
    @NotBlank(message = "KPI name is required")
    private String kpiName;

    @NotNull
    @Positive(message = "Benchmark value must be positive")
    private Float benchmarkValue;
}
