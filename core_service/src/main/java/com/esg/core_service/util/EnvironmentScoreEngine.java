package com.esg.core_service.util;

import com.esg.core_service.entity.EnvironmentBenchmark;
import com.esg.core_service.entity.EnvironmentMetric;

import java.util.List;

public class EnvironmentScoreEngine {

    public static float calculateScore(
            EnvironmentMetric metric,
            List<EnvironmentBenchmark> benchmarks
    ) {
        int total = benchmarks.size();
        int passed = 0;

        for (EnvironmentBenchmark b : benchmarks) {
            float value = switch (b.getKpiName()) {
                case "EUI" -> metric.getEnergyUseIntensity();
                case "RENEWABLE_PERCENT" -> metric.getRenewableEnergyPercent();
                case "PUE" -> metric.getDataCenterPue();
                case "WATER_PER_EMP" -> metric.getWaterPerEmployee();
                case "EWASTE_RECYCLE" -> metric.getEwasteRecyclingPercent();
                case "CARBON_INTENSITY" -> metric.getCarbonIntensity();
                default -> 0;
            };

            boolean ok = b.getComparisonType().equals("LESS_THAN")
                    ? value <= b.getBenchmarkValue()
                    : value >= b.getBenchmarkValue();

            if (ok) passed++;
        }

        return (passed * 100f) / total;
    }
}