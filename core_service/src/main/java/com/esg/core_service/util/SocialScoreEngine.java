package com.esg.core_service.util;

import com.esg.core_service.entity.SocialBenchmark;
import com.esg.core_service.entity.SocialMetric;

import java.util.List;

public class SocialScoreEngine {

    public static float calculateScore(
            SocialMetric metric,
            List<SocialBenchmark> benchmarks
    ) {
        float total = 0;
        int count = 0;

        for (SocialBenchmark b : benchmarks) {
            float actual = getMetricValue(metric, b.getKpiName());
            boolean passed = compare(actual, b.getBenchmarkValue(), b.getComparisonType());

            if (passed) total += 100;
            count++;
        }

        return count == 0 ? 0 : total / count;
    }

    private static boolean compare(float actual, float target, String type) {
        return switch (type) {
            case "GREATER_THAN" -> actual >= target;
            case "LESS_THAN" -> actual <= target;
            default -> false;
        };
    }

    private static float getMetricValue(SocialMetric m, String kpi) {
        return switch (kpi) {
            case "WOMEN_WORKFORCE" -> m.getWomenWorkforcePercent();
            case "WOMEN_LEADERSHIP" -> m.getWomenLeadershipPercent();
            case "ATTRITION" -> m.getAttritionRate();
            case "TRAINING" -> m.getTrainingHoursPerEmployee();
            case "SATISFACTION" -> m.getEmployeeSatisfactionScore();
            case "INSURANCE" -> m.getHealthInsuranceCoveragePercent();
            case "LTIFR" -> m.getInjuryRate();
            case "MENTAL_HEALTH" -> m.getMentalHealthCoveragePercent();
            default -> 0;
        };
    }
}