package com.esg.core_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class SocialBenchmarkRequestDto {

    @NotBlank
    private String kpiName;

    @NotNull
    private Float benchmarkValue;
}