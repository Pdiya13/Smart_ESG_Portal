package com.esg.core_service.util;

import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor
public class EnvironmentBenchmarkRules {

    public static void validateBenchmark(String kpiName, float benchmarkValue) {

        switch (kpiName) {

            case "EUI" -> {
                if (benchmarkValue > 110)
                    throw new IllegalArgumentException("EUI cannot be greater than 110 kWh/m²");
            }

            case "RENEWABLE_PERCENT" -> {
                if (benchmarkValue < 30)
                    throw new IllegalArgumentException("Renewable Energy % must be at least 30%");
            }

            case "PUE" -> {
                if (benchmarkValue > 1.6)
                    throw new IllegalArgumentException("Data Center PUE cannot exceed 1.6");
            }

            case "WATER_PER_EMP" -> {
                if (benchmarkValue > 40)
                    throw new IllegalArgumentException("Water per employee cannot exceed 40 L/day");
            }

            case "EWASTE_RECYCLE" -> {
                if (benchmarkValue < 90)
                    throw new IllegalArgumentException("E-waste recycling must be at least 90%");
            }

            case "CARBON_INTENSITY" -> {
                if (benchmarkValue > 80)
                    throw new IllegalArgumentException("Carbon intensity cannot exceed 80 kg CO₂/m²");
            }

            default -> throw new IllegalArgumentException("Invalid KPI name");
        }
    }

    public static String getComparisonType(String kpiName) {

        return switch (kpiName) {
            case "EUI", "PUE", "WATER_PER_EMP", "CARBON_INTENSITY" -> "LESS_THAN";
            case "RENEWABLE_PERCENT", "EWASTE_RECYCLE" -> "GREATER_THAN";
            default -> throw new IllegalArgumentException("Invalid KPI name");
        };
    }
}
