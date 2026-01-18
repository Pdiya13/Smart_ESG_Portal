package com.esg.core_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Governance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID governanceId;

    @NotNull
    private UUID companyId;

    @NotNull
    @Min(2000)
    private Integer reportingYear;

    @NotNull @Min(1)
    private Integer totalBoardMembers;

    @NotNull @Min(0)
    private Integer independentDirectors;

    @NotNull @Min(0)
    private Integer femaleDirectors;

    @NotNull @Min(0)
    private Integer boardMeetings;

    @NotNull
    @Min(0) @Max(100)
    private Float independentAttendancePercent;

    @NotNull
    private Boolean dataPrivacyCompliant;

    @NotNull
    private Boolean iso27001Certified;

    @NotNull @Min(0)
    private Integer cybersecurityIncidents;

    @NotNull @Min(0)
    private Integer whistleblowerComplaints;

    @NotNull @Min(0)
    private Integer complaintsResolved;

    @NotNull @Min(0)
    private Integer antiCorruptionViolations;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }
}