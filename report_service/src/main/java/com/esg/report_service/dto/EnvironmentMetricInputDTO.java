package com.esg.report_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EnvironmentMetricInputDTO {
    @NotNull(message = "")
    private Float energyUseIntensity;

    @NotNull
    private Float renewableEnergyPercent;

    @NotNull
    private Float dataCenterPue;

    @NotNull
    private Float waterPerEmployee;

    @NotNull
    private Float ewasteRecyclingPercent;

    @NotNull
    private Float carbonIntensity;
}
