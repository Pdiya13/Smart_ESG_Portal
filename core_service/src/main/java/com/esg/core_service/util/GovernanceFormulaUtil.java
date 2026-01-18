package com.esg.core_service.util;

import com.esg.core_service.entity.Governance;
import com.esg.core_service.entity.GovernanceMetric;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@NoArgsConstructor
public class GovernanceFormulaUtil {

    // Board Independence % = (independent / total) * 100
    public static float boardIndependence(int independent, int total) {
        if (total == 0) return 0f;
        return (independent * 100f) / total;
    }

    // Female Directors % = (female / total) * 100
    public static float femaleBoard(int female, int total) {
        if (total == 0) return 0f;
        return (female * 100f) / total;
    }

    // Whistleblower Resolution % = (resolved / complaints) * 100
    // If no complaints → treated as fully compliant
    public static float whistleblowerResolution(int resolved, int complaints) {
        if (complaints == 0) return 100f;
        return (resolved * 100f) / complaints;
    }

    // Governance Risk Level
    // HIGH → any cyber or corruption issue
    // LOW  → clean governance
    public static String riskLevel(int cyberIncidents, int corruptionCases) {
        if (cyberIncidents > 0 || corruptionCases > 0) {
            return "HIGH";
        }
        return "LOW";
    }

    // 🔹 AUTO KPI CALCULATION FROM ENTITY
    public static GovernanceMetric calculateAll(Governance g) {

        GovernanceMetric m = new GovernanceMetric();

        m.setGovernanceId(g.getGovernanceId());
        m.setCompanyId(g.getCompanyId());
        m.setReportingYear(g.getReportingYear());

        m.setBoardIndependencePercent(
                boardIndependence(
                        g.getIndependentDirectors(),
                        g.getTotalBoardMembers()
                )
        );

        m.setFemaleDirectorPercent(
                femaleBoard(
                        g.getFemaleDirectors(),
                        g.getTotalBoardMembers()
                )
        );

        m.setWhistleblowerResolutionPercent(
                whistleblowerResolution(
                        g.getComplaintsResolved(),
                        g.getWhistleblowerComplaints()
                )
        );

        m.setRiskLevel(
                riskLevel(
                        g.getCybersecurityIncidents(),
                        g.getAntiCorruptionViolations()
                )
        );

        m.setCalculatedAt(Instant.now());
        return m;
    }
}