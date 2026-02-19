package com.esg.report_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class GovernanceMetricInputDTO {

    @NotNull(message = "Board Independence Percentage is required")
    @Min(value = 0, message = "Board Independence cannot be negative")
    @Max(value = 100, message = "Board Independence cannot exceed 100")
    private Float boardIndependencePercent;

    @NotNull(message = "Female Director Percentage is required")
    @Min(value = 0, message = "Female Director Percentage cannot be negative")
    @Max(value = 100, message = "Female Director Percentage cannot exceed 100")
    private Float femaleDirectorPercent;

    @NotNull(message = "Whistleblower Resolution Percentage is required")
    @Min(value = 0, message = "Whistleblower Resolution cannot be negative")
    @Max(value = 100, message = "Whistleblower Resolution cannot exceed 100")
    private Float whistleblowerResolutionPercent;

    @NotNull(message = "Risk Level is required")
    private String riskLevel;
}