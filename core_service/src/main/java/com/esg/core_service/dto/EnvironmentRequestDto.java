package com.esg.core_service.dto;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EnvironmentRequestDto {

    @NotNull(message = "Reporting year is required")
    @Min(value = 2000, message = "Invalid reporting year")
    private Integer reportingYear;

    @NotNull
    @Positive(message = "Electricity must be positive")
    private Float totalElectricityKwh;

    @NotNull
    @Positive(message = "Office area must be positive")
    private Float officeAreaSqm;

    @NotNull
    @PositiveOrZero
    private Float dieselUsedLiters;

    @NotNull
    @PositiveOrZero
    private Float renewableEnergyKwh;

    @NotNull
    @Positive
    private Float dataCenterTotalEnergyKwh;

    @NotNull
    @Positive
    private Float dataCenterItEnergyKwh;

    @NotNull
    @Positive
    private Float totalWaterLiters;

    @NotNull
    @PositiveOrZero
    private Float recycledWaterLiters;

    @NotNull
    @Min(value = 1, message = "Employees must be at least 1")
    private Integer totalEmployees;

    @NotNull
    @Positive
    private Float ewasteGenerated;

    @NotNull
    @PositiveOrZero
    private Float ewasteRecycled;

    @NotNull
    @Positive
    private Float electricityEmissionFactor;

    @NotNull
    @Positive
    private Float dieselEmissionFactor;

    @NotNull
    private Boolean rainwaterHarvesting;
}
