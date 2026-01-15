package com.esg.core_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Social {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID socialId;

    @NotNull
    private UUID companyId;

    @NotNull
    private Integer reportingYear;

    @NotNull @Min(1)
    private Integer totalEmployees;

    @NotNull @Min(0)
    private Integer womenEmployees;

    @NotNull @Min(1)
    private Integer totalManagers;

    @NotNull @Min(0)
    private Integer womenManagers;

    @NotNull @Min(0)
    private Integer employeesJoined;

    @NotNull @Min(0)
    private Integer employeesLeft;

    @NotNull @PositiveOrZero
    private Float totalTrainingHours;

    @NotNull @Min(0) @Max(100)
    private Float employeeSatisfactionScore;

    @NotNull @Min(0)
    private Integer healthInsuranceCovered;

    @NotNull @Min(0)
    private Integer mentalHealthProgramCovered;

    @NotNull @Min(0)
    private Integer workplaceInjuries;

    @NotNull @Positive
    private Float totalWorkHours;

    @NotNull @Min(0)
    private Integer remoteEmployees;

    @NotNull
    private LocalDateTime createdAt;
}