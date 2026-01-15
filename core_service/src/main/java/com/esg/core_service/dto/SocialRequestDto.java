package com.esg.core_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class SocialRequestDto {

    @NotNull private Integer reportingYear;
    @NotNull @Min(1) private Integer totalEmployees;
    @NotNull private Integer womenEmployees;
    @NotNull private Integer totalManagers;
    @NotNull private Integer womenManagers;
    @NotNull private Integer employeesJoined;
    @NotNull private Integer employeesLeft;
    @NotNull private Float totalTrainingHours;
    @NotNull private Float employeeSatisfactionScore;
    @NotNull private Integer healthInsuranceCovered;
    @NotNull private Integer mentalHealthProgramCovered;
    @NotNull private Integer workplaceInjuries;
    @NotNull private Float totalWorkHours;
    @NotNull private Integer remoteEmployees;
}