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
public class GovernanceMetricInputDTO {
    @NotNull(message = "Board meeting attendance percentage is required")
    @Min(value = 0, message = "Attendance percentage cannot be negative")
    @Max(value = 100, message = "Attendance percentage cannot exceed 100")
    private Float attendance;

    @NotNull(message = "Number of board meetings is required")
    @Min(value = 0, message = "Board meetings cannot be negative")
    private Float boardMeetings;

    @NotNull(message = "Female directors percentage is required")
    @Min(value = 0, message = "Female directors percentage cannot be negative")
    @Max(value = 100, message = "Female directors percentage cannot exceed 100")
    private Float femaleDirectors;

    @NotNull(message = "Data privacy compliance score is required")
    @Min(value = 0, message = "Data privacy score cannot be negative")
    @Max(value = 100, message = "Data privacy score cannot exceed 100")
    private Float dataPrivacy;

    @NotNull(message = "ISO 27001 compliance score is required")
    @Min(value = 0, message = "ISO 27001 score cannot be negative")
    @Max(value = 100, message = "ISO 27001 score cannot exceed 100")
    private Float iso27001;

    @NotNull(message = "Cyber security incidents count is required")
    @Min(value = 0, message = "Cyber incidents cannot be negative")
    private Float cyberIncidents;

    @NotNull(message = "Whistleblower resolution percentage is required")
    @Min(value = 0, message = "Whistleblower resolution percentage cannot be negative")
    @Max(value = 100, message = "Whistleblower resolution percentage cannot exceed 100")
    private Float whistleblowerResolution;

    @NotNull(message = "Anti-corruption compliance score is required")
    @Min(value = 0, message = "Anti-corruption score cannot be negative")
    @Max(value = 100, message = "Anti-corruption score cannot exceed 100")
    private Float antiCorruption;

    @NotNull(message = "Board independence percentage is required")
    @Min(value = 0, message = "Board independence percentage cannot be negative")
    @Max(value = 100, message = "Board independence percentage cannot exceed 100")
    private Float boardIndependence;
}
