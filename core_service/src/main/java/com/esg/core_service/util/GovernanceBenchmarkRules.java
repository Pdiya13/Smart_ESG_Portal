package com.esg.core_service.util;

public class GovernanceBenchmarkRules {

    public static void validate(String kpi, Float value) {

        switch (kpi) {
            case "BOARD_INDEPENDENCE",
                 "FEMALE_DIRECTORS",
                 "BOARD_ATTENDANCE",
                 "WHISTLEBLOWER_RESOLUTION" -> {
                if (value < 0 || value > 100)
                    throw new IllegalArgumentException("Percentage must be 0–100");
            }

            case "BOARD_MEETINGS",
                 "CYBER_INCIDENTS",
                 "ANTI_CORRUPTION" -> {
                if (value < 0)
                    throw new IllegalArgumentException("Value cannot be negative");
            }

            case "DATA_PRIVACY",
                 "ISO_27001" -> {
                // boolean KPI → expect 1 (true) or 0 (false)
                if (!(value == 0 || value == 1))
                    throw new IllegalArgumentException("Boolean KPI must be 0 or 1");
            }
        }
    }

    public static String comparisonType(String kpi) {
        return switch (kpi) {
            case "BOARD_INDEPENDENCE",
                 "FEMALE_DIRECTORS",
                 "BOARD_ATTENDANCE",
                 "WHISTLEBLOWER_RESOLUTION",
                 "BOARD_MEETINGS" -> "GREATER_THAN";

            case "CYBER_INCIDENTS",
                 "ANTI_CORRUPTION" -> "LESS_THAN";

            case "DATA_PRIVACY",
                 "ISO_27001" -> "BOOLEAN";

            default -> "GREATER_THAN";
        };
    }
}