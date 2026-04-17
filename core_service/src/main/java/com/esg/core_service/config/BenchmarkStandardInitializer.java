package com.esg.core_service.config;

import com.esg.core_service.entity.BenchmarkStandard;
import com.esg.core_service.repository.BenchmarkStandardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BenchmarkStandardInitializer implements CommandLineRunner {

    private final BenchmarkStandardRepository repository;

    @Override
    public void run(String... args) {

        if (repository.count() > 0) {
            log.info("Benchmark standards already seeded. Skipping.");
            return;
        }

        log.info("Seeding global benchmark standards...");

        List<BenchmarkStandard> standards = List.of(

            // ── ENVIRONMENT ──────────────────────────────────────────────────────
            BenchmarkStandard.builder()
                .category("ENVIRONMENT").kpiName("EUI")
                .benchmarkValue(110f).comparisonType("LESS_THAN")
                .description("Energy Use Intensity (kWh/m²)").build(),

            BenchmarkStandard.builder()
                .category("ENVIRONMENT").kpiName("RENEWABLE_PERCENT")
                .benchmarkValue(30f).comparisonType("GREATER_THAN")
                .description("Renewable Energy (%)").build(),

            BenchmarkStandard.builder()
                .category("ENVIRONMENT").kpiName("PUE")
                .benchmarkValue(1.6f).comparisonType("LESS_THAN")
                .description("Data Center Power Usage Effectiveness").build(),

            BenchmarkStandard.builder()
                .category("ENVIRONMENT").kpiName("WATER_PER_EMP")
                .benchmarkValue(40f).comparisonType("LESS_THAN")
                .description("Water per employee (L/day)").build(),

            BenchmarkStandard.builder()
                .category("ENVIRONMENT").kpiName("EWASTE_RECYCLE")
                .benchmarkValue(90f).comparisonType("GREATER_THAN")
                .description("E-waste recycling rate (%)").build(),

            BenchmarkStandard.builder()
                .category("ENVIRONMENT").kpiName("CARBON_INTENSITY")
                .benchmarkValue(80f).comparisonType("LESS_THAN")
                .description("Carbon intensity (kg CO₂/m²)").build(),

            // ── SOCIAL ───────────────────────────────────────────────────────────
            BenchmarkStandard.builder()
                .category("SOCIAL").kpiName("WOMEN_WORKFORCE")
                .benchmarkValue(40f).comparisonType("GREATER_THAN")
                .description("Women in total workforce (%)").build(),

            BenchmarkStandard.builder()
                .category("SOCIAL").kpiName("WOMEN_LEADERSHIP")
                .benchmarkValue(20f).comparisonType("GREATER_THAN")
                .description("Women in leadership roles (%)").build(),

            BenchmarkStandard.builder()
                .category("SOCIAL").kpiName("ATTRITION")
                .benchmarkValue(15f).comparisonType("LESS_THAN")
                .description("Annual attrition rate (%)").build(),

            BenchmarkStandard.builder()
                .category("SOCIAL").kpiName("TRAINING")
                .benchmarkValue(20f).comparisonType("GREATER_THAN")
                .description("Avg training hours per employee").build(),

            BenchmarkStandard.builder()
                .category("SOCIAL").kpiName("SATISFACTION")
                .benchmarkValue(75f).comparisonType("GREATER_THAN")
                .description("Employee satisfaction score (0-100)").build(),

            BenchmarkStandard.builder()
                .category("SOCIAL").kpiName("INSURANCE")
                .benchmarkValue(100f).comparisonType("EQUALS")
                .description("Employees with health insurance (%)").build(),

            BenchmarkStandard.builder()
                .category("SOCIAL").kpiName("LTIFR")
                .benchmarkValue(0.3f).comparisonType("LESS_THAN")
                .description("Lost Time Injury Frequency Rate").build(),

            BenchmarkStandard.builder()
                .category("SOCIAL").kpiName("MENTAL_HEALTH")
                .benchmarkValue(50f).comparisonType("GREATER_THAN")
                .description("Mental health support coverage (%)").build(),

            // ── GOVERNANCE ───────────────────────────────────────────────────────
            BenchmarkStandard.builder()
                .category("GOVERNANCE").kpiName("BOARD_INDEPENDENCE")
                .benchmarkValue(50f).comparisonType("GREATER_THAN")
                .description("Independent board members (%)").build(),

            BenchmarkStandard.builder()
                .category("GOVERNANCE").kpiName("FEMALE_DIRECTORS")
                .benchmarkValue(33f).comparisonType("GREATER_THAN")
                .description("Female directors on board (%)").build(),

            BenchmarkStandard.builder()
                .category("GOVERNANCE").kpiName("ATTENDANCE")
                .benchmarkValue(90f).comparisonType("GREATER_THAN")
                .description("Board meeting attendance (%)").build(),

            BenchmarkStandard.builder()
                .category("GOVERNANCE").kpiName("WHISTLEBLOWER_RESOLUTION")
                .benchmarkValue(100f).comparisonType("EQUALS")
                .description("Whistleblower complaints resolved (%)").build(),

            BenchmarkStandard.builder()
                .category("GOVERNANCE").kpiName("BOARD_MEETINGS")
                .benchmarkValue(4f).comparisonType("GREATER_THAN")
                .description("Board meetings per year").build(),

            BenchmarkStandard.builder()
                .category("GOVERNANCE").kpiName("CYBER_INCIDENTS")
                .benchmarkValue(0f).comparisonType("LESS_THAN")
                .description("Major cybersecurity incidents").build(),

            BenchmarkStandard.builder()
                .category("GOVERNANCE").kpiName("ANTI_CORRUPTION")
                .benchmarkValue(0f).comparisonType("LESS_THAN")
                .description("Confirmed incidents of corruption").build(),

            BenchmarkStandard.builder()
                .category("GOVERNANCE").kpiName("DATA_PRIVACY")
                .benchmarkValue(1f).comparisonType("BOOLEAN")
                .description("Data privacy policy in place").build(),

            BenchmarkStandard.builder()
                .category("GOVERNANCE").kpiName("ISO_27001")
                .benchmarkValue(1f).comparisonType("BOOLEAN")
                .description("ISO 27001 Certification status").build()
        );

        repository.saveAll(standards);
        log.info("Seeded {} benchmark standards successfully.", standards.size());
    }
}
