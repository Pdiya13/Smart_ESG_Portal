package com.esg.core_service.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "environment_metric")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EnvironmentMetric {

    @Id
    @Column(name = "metric_id", nullable = false, updatable = false)
    private UUID metricId;

    @NotNull
    private UUID environmentId;

    @NotNull
    private UUID companyId;

    @NotNull
    private Integer reportingYear;

    @NotNull @Positive
    private Float energyUseIntensity;

    @NotNull @Min(0)
    private Float renewableEnergyPercent;

    @NotNull @Positive
    private Float dataCenterPue;

    @NotNull @Positive
    private Float waterPerEmployee;

    @NotNull @Min(0)
    private Float recycledWaterPercent;

    @NotNull @Min(0)
    private Float ewasteRecyclingPercent;

    @NotNull @PositiveOrZero
    private Float electricityCo2Emission;

    @NotNull @PositiveOrZero
    private Float dieselCo2Emission;

    @NotNull @PositiveOrZero
    private Float totalCo2Emission;

    @NotNull @PositiveOrZero
    private Float carbonIntensity;

    @NotNull
    private LocalDateTime calculatedAt;
}