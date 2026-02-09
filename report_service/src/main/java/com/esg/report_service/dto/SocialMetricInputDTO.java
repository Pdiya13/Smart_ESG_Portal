package com.esg.report_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialMetricInputDTO  {
    @NotNull(message = "Women workforce percentage is required")
    @Min(value = 0, message = "Women workforce percentage cannot be negative")
    @Max(value = 100, message = "Women workforce percentage cannot exceed 100")
    private Float womenWorkforce;

    @NotNull(message = "Women leadership percentage is required")
    @Min(value = 0, message = "Women leadership percentage cannot be negative")
    @Max(value = 100, message = "Women leadership percentage cannot exceed 100")
    private Float womenLeadership;

    @NotNull(message = "Employee attrition rate is required")
    @Min(value = 0, message = "Attrition rate cannot be negative")
    @Max(value = 100, message = "Attrition rate cannot exceed 100")
    private Float attrition;

    @NotNull(message = "Training hours per employee is required")
    @Min(value = 0, message = "Training hours cannot be negative")
    private Float training;

    @NotNull(message = "Employee satisfaction percentage is required")
    @Min(value = 0, message = "Satisfaction percentage cannot be negative")
    @Max(value = 100, message = "Satisfaction percentage cannot exceed 100")
    private Float satisfaction;

    @NotNull(message = "Insurance coverage percentage is required")
    @Min(value = 0, message = "Insurance coverage percentage cannot be negative")
    @Max(value = 100, message = "Insurance coverage percentage cannot exceed 100")
    private Float insurance;

    @NotNull(message = "Lost Time Injury Frequency Rate (LTIFR) is required")
    @Min(value = 0, message = "LTIFR cannot be negative")
    private Float ltifr;

    @NotNull(message = "Mental health program coverage percentage is required")
    @Min(value = 0, message = "Mental health coverage percentage cannot be negative")
    @Max(value = 100, message = "Mental health coverage percentage cannot exceed 100")
    private Float mentalHealth;
}
