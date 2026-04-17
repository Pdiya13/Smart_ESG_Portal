package com.esg.core_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "benchmark_standards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BenchmarkStandard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String category; // ENVIRONMENT, SOCIAL, GOVERNANCE

    @Column(nullable = false, unique = true)
    private String kpiName;

    @Column(nullable = false)
    private float benchmarkValue;

    @Column(nullable = false)
    private String comparisonType; // LESS_THAN, GREATER_THAN, EQUALS, BOOLEAN

    private String description;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
