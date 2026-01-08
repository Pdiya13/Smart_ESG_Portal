package com.esg.core_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Environment {
    @Id
    @Column(name = "environment_id", nullable = false, updatable = false)
    private UUID environmentId;

    @NotNull
    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @NotNull
    private Integer reportingYear;

    @NotNull @Positive
    private Float totalElectricityKwh;

    @NotNull @Positive
    private Float officeAreaSqm;

    @PositiveOrZero
    private Float dieselUsedLiters;

    @PositiveOrZero
    private Float renewableEnergyKwh;

    @NotNull @Positive
    private Float dataCenterTotalEnergyKwh;

    @NotNull @Positive
    private Float dataCenterItEnergyKwh;

    @NotNull @Positive
    private Float totalWaterLiters;

    @PositiveOrZero
    private Float recycledWaterLiters;

    @NotNull
    @Min(1)
    private Integer totalEmployees;

    @NotNull @Positive
    private Float ewasteGenerated;

    @PositiveOrZero
    private Float ewasteRecycled;

    @NotNull @Positive
    private Float electricityEmissionFactor;

    @NotNull @Positive
    private Float dieselEmissionFactor;

    @NotNull
    private Boolean rainwaterHarvesting;

    @NotNull
    private LocalDateTime createdAt;
}
