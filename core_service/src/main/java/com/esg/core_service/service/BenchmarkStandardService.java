package com.esg.core_service.service;

import com.esg.core_service.entity.BenchmarkStandard;
import com.esg.core_service.repository.BenchmarkStandardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BenchmarkStandardService {

    private final BenchmarkStandardRepository repository;

    public List<BenchmarkStandard> getAllStandards() {
        return repository.findAll();
    }

    public Optional<BenchmarkStandard> getStandardByKpi(String kpiName) {
        return repository.findByKpiName(kpiName);
    }

    public BenchmarkStandard updateStandard(String kpiName, float newValue) {
        BenchmarkStandard standard = repository.findByKpiName(kpiName)
                .orElseThrow(() -> new IllegalArgumentException("Benchmark standard not found for KPI: " + kpiName));
        
        standard.setBenchmarkValue(newValue);
        return repository.save(standard);
    }

    /**
     * Replaces the logic in static utility classes.
     * Validates a value against the dynamic benchmark standard.
     */
    public void validate(String kpiName, float value) {
        BenchmarkStandard standard = repository.findByKpiName(kpiName)
                .orElseThrow(() -> new IllegalArgumentException("No benchmark standard defined for: " + kpiName));

        float limit = standard.getBenchmarkValue();
        String type = standard.getComparisonType();

        switch (type) {
            case "LESS_THAN" -> {
                if (value > limit) {
                    throw new IllegalArgumentException(String.format("%s must be ≤ %s", kpiName, limit));
                }
            }
            case "GREATER_THAN" -> {
                if (value < limit) {
                    throw new IllegalArgumentException(String.format("%s must be ≥ %s", kpiName, limit));
                }
            }
            case "EQUALS" -> {
                if (value != limit) {
                    throw new IllegalArgumentException(String.format("%s must be exactly %s", kpiName, limit));
                }
            }
            case "BOOLEAN" -> {
                if (value != 0 && value != 1) {
                    throw new IllegalArgumentException(String.format("%s must be 0 (No) or 1 (Yes)", kpiName));
                }
            }
        }
    }

    /**
     * Returns the comparison type for a given KPI.
     */
    public String getComparisonType(String kpiName) {
        return repository.findByKpiName(kpiName)
                .map(BenchmarkStandard::getComparisonType)
                .orElse("GREATER_THAN"); // Default
    }
}
