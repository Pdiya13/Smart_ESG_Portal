package com.esg.core_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
public class GovernanceBenchmark {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID benchmarkId;

    private UUID companyId;

    @NotBlank
    private String kpiName;

    private Float benchmarkValue;

    @NotBlank
    private String comparisonType; // GREATER_THAN, LESS_THAN, BOOLEAN

    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }
}