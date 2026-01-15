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
public class SocialBenchmark {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID benchmarkId;

    @NotNull
    private UUID companyId;

    @NotBlank
    private String kpiName;

    @NotNull
    private Float benchmarkValue;

    @NotBlank
    private String comparisonType;   // GREATER_THAN / LESS_THAN

    @NotNull
    private LocalDateTime createdAt;
}