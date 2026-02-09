package com.esg.report_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class EnvironmentMetricInputDTO {
    @NotNull(message = "Energy Use Intensity (EUI) is required")
    @Min(value = 0, message = "EUI cannot be negative")
    private Float eui;

    @NotNull(message = "Renewable energy percentage is required")
    @Min(value = 0, message = "Renewable energy percentage cannot be negative")
    @Max(value = 100, message = "Renewable energy percentage cannot exceed 100")
    private Float renewableEnergyPercentage;

    @NotNull(message = "Power Usage Effectiveness (PUE) is required")
    @Min(value = 0, message = "PUE cannot be negative")
    private Float pue;

    @NotNull(message = "Water consumption per employee is required")
    @Min(value = 0, message = "Water consumption per employee cannot be negative")
    private Float waterPerEmployee;

    @NotNull(message = "E-waste recycling percentage is required")
    @Min(value = 0, message = "E-waste recycling percentage cannot be negative")
    @Max(value = 100, message = "E-waste recycling percentage cannot exceed 100")
    private Float eWasteRecyclingPercentage;

    @NotNull(message = "Carbon intensity is required")
    @Min(value = 0, message = "Carbon intensity cannot be negative")
    private Float carbonIntensity;
}
