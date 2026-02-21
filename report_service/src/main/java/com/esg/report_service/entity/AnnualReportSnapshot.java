package com.esg.report_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnualReportSnapshot {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID companyId;

    private Integer reportingYear;

    private Float environmentScore;
    private Float socialScore;
    private Float governanceScore;
    private Float totalEsgScore;

    private String rating;

    private LocalDateTime generatedAt;
}