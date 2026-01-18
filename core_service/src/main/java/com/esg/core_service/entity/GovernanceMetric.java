package com.esg.core_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GovernanceMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID metricId;

    private UUID governanceId;
    private UUID companyId;
    private Integer reportingYear;

    private Float boardIndependencePercent;
    private Float femaleDirectorPercent;
    private Float whistleblowerResolutionPercent;

    private String riskLevel; // LOW / MEDIUM / HIGH

    private Instant calculatedAt;
}