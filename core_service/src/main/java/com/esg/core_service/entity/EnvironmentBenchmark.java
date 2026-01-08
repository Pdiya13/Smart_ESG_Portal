package com.esg.core_service.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "environment_benchmark")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EnvironmentBenchmark {
    @Id
    @Column(name = "environment_id", nullable = false, updatable = false)
    private UUID benchmarkId;

    @NotNull
    private UUID companyId;

    @NotBlank
    private String kpiName;

    @NotNull @Positive
    private Float benchmarkValue;

    @NotBlank
    private String comparisonType;

    @NotNull
    private LocalDateTime createdAt;
}
