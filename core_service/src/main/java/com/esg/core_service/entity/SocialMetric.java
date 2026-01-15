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
public class SocialMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID metricId;

    private UUID socialId;
    private UUID companyId;
    private Integer reportingYear;

    private Float womenWorkforcePercent;
    private Float womenLeadershipPercent;
    private Float attritionRate;
    private Float hiringRate;
    private Float trainingPerEmployee;
    private Float insuranceCoveragePercent;
    private Float mentalHealthCoveragePercent;
    private Float ltifr;
    private Float remoteWorkPercent;

    private LocalDateTime calculatedAt;
}