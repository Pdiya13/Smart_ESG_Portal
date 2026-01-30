package com.esg.report_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "esg_report")
@Getter
@Setter
public class EsgReport {
    @Id
    @GeneratedValue
    private UUID reportId;

    @Column(nullable = false)
    private UUID companyId;

    @Column(nullable = false)
    private Integer reportingYear;

    @Column
    private Integer environmentScore;

    @Column
    private Integer socialScore;

    @Column
    private Integer governanceScore;

    @Column(nullable = false)
    private Integer totalEsgScore;

    @Column(nullable = false)
    private LocalDateTime generatedAt;

    @OneToMany(
            mappedBy = "report",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<EsgKpiResult> kpiResults;

    @PrePersist
    protected void onCreate() {
        this.generatedAt = LocalDateTime.now();
    }
}
