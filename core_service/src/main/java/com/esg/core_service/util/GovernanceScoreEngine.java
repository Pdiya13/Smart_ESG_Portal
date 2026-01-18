package com.esg.core_service.util;

import com.esg.core_service.entity.GovernanceBenchmark;
import com.esg.core_service.entity.GovernanceMetric;

import java.util.List;

public class GovernanceScoreEngine {

    public static float calculateScore(
            GovernanceMetric m,
            List<GovernanceBenchmark> benchmarks) {

        int pass = 0;

        for (GovernanceBenchmark b : benchmarks) {
            float actual = getMetricValue(m, b.getKpiName());

            boolean ok = switch (b.getComparisonType()) {
                case "GREATER_THAN" -> actual >= b.getBenchmarkValue();
                case "LESS_THAN" -> actual <= b.getBenchmarkValue();
                default -> true;
            };

            if (ok) pass++;
        }

        return (pass * 100f) / benchmarks.size();
    }

    private static float getMetricValue(GovernanceMetric m, String kpi) {

        return switch (kpi) {
            case "BOARD_INDEPENDENCE" -> m.getBoardIndependencePercent();
            case "FEMALE_DIRECTORS" -> m.getFemaleDirectorPercent();
            case "WHISTLEBLOWER_RESOLUTION" -> m.getWhistleblowerResolutionPercent();
            default -> 0f;
        };
    }
}
