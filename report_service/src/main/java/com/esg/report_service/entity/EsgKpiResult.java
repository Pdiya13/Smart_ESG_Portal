package com.esg.report_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "esg_kpi_result")
@Data
@Getter
@Setter
public class EsgKpiResult {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private EsgReport report;

    @Column(nullable = false)
    private String kpiName;

    @Column(nullable = false)
    private Float actualValue;

    @Column(nullable = false)
    private Float benchmarkValue;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private KpiStatus  status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EsgPillar pillar;
}
