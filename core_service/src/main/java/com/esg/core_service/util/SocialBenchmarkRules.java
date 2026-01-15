package com.esg.core_service.util;

public class SocialBenchmarkRules {

    public static void validate(String kpi, float value) {

        switch (kpi) {

            case "WOMEN_WORKFORCE" -> {
                if (value < 40) throw new IllegalArgumentException("Women workforce ≥ 40%");
            }

            case "WOMEN_LEADERSHIP" -> {
                if (value < 20) throw new IllegalArgumentException("Women leadership ≥ 20%");
            }

            case "ATTRITION" -> {
                if (value > 15) throw new IllegalArgumentException("Attrition ≤ 15%");
            }

            case "TRAINING" -> {
                if (value < 20) throw new IllegalArgumentException("Training ≥ 20 hrs");
            }

            case "SATISFACTION" -> {
                if (value < 75) throw new IllegalArgumentException("Satisfaction ≥ 75");
            }

            case "INSURANCE" -> {
                if (value != 100) throw new IllegalArgumentException("Insurance must be 100%");
            }

            case "LTIFR" -> {
                if (value > 0.3) throw new IllegalArgumentException("LTIFR ≤ 0.3");
            }

            case "MENTAL_HEALTH" -> {
                if (value < 50) throw new IllegalArgumentException("Mental health ≥ 50%");
            }
        }
    }

    public static String getComparison(String kpi) {
        return switch (kpi) {
            case "ATTRITION", "LTIFR" -> "LESS_THAN";
            default -> "GREATER_THAN";
        };
    }
}