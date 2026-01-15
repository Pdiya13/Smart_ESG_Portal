package com.esg.core_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "esg_score")
public class ESGScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID esgScoreId;

    @NotNull
    private UUID companyId;

    @NotNull
    private Integer reportingYear;

    @NotNull
    private Float environmentScore;

    @NotNull
    private Float socialScore;

    @NotNull
    private Float governanceScore;

    @NotNull
    private Float totalEsgScore;

    @NotNull
    private String rating;  // A / B / C

    @NotNull
    private LocalDateTime calculatedAt;
}