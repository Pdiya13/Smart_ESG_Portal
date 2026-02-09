package com.esg.report_service.service;

import com.esg.report_service.dto.EnvironmentMetricInputDTO;
import com.esg.report_service.entity.EsgKpiResult;
import com.esg.report_service.entity.EsgPillar;
import com.esg.report_service.entity.EsgReport;
import com.esg.report_service.entity.KpiStatus;
import com.esg.report_service.repository.EsgKpiResultRepository;
import com.esg.report_service.repository.EsgReportRepository;
import com.esg.report_service.util.EnvironmentBenchmarkConstants;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnvironmentReportService
{
    public void evaluate(EnvironmentMetricInputDTO m, EsgReport report, List<EsgKpiResult> results)
    {
        add("EUI", m.getEui(),
                EnvironmentBenchmarkConstants.EUI_MAX,
                m.getEui() <= EnvironmentBenchmarkConstants.EUI_MAX,
                report, results);

        add("RENEWABLE_ENERGY", m.getRenewableEnergyPercentage(),
                EnvironmentBenchmarkConstants.RENEWABLE_ENERGY_MIN,
                m.getRenewableEnergyPercentage() >= EnvironmentBenchmarkConstants.RENEWABLE_ENERGY_MIN,
                report, results);

        add("PUE", m.getPue(),
                EnvironmentBenchmarkConstants.PUE_MAX,
                m.getPue() <= EnvironmentBenchmarkConstants.PUE_MAX,
                report, results);

        add("WATER_PER_EMPLOYEE", m.getWaterPerEmployee(),
                EnvironmentBenchmarkConstants.WATER_PER_EMPLOYEE_MAX,
                m.getWaterPerEmployee() <= EnvironmentBenchmarkConstants.WATER_PER_EMPLOYEE_MAX,
                report, results);

        add("EWASTE_RECYCLING", m.getEWasteRecyclingPercentage(),
                EnvironmentBenchmarkConstants.EWASTE_RECYCLING_MIN,
                m.getEWasteRecyclingPercentage() >= EnvironmentBenchmarkConstants.EWASTE_RECYCLING_MIN,
                report, results);

        add("CARBON_INTENSITY", m.getCarbonIntensity(),
                EnvironmentBenchmarkConstants.CARBON_INTENSITY_MAX,
                m.getCarbonIntensity() <= EnvironmentBenchmarkConstants.CARBON_INTENSITY_MAX,
                report, results);
    }

    private void add(
            String kpi,
            Float actual,
            Float benchmark,
            boolean pass,
            EsgReport report,
            List<EsgKpiResult> results
    ) {
        EsgKpiResult r = new EsgKpiResult();
        r.setReport(report);
        r.setKpiName(kpi);
        r.setActualValue(actual);
        r.setBenchmarkValue(benchmark);
        r.setStatus(pass ? KpiStatus.PASS : KpiStatus.FAIL);
        r.setPillar(EsgPillar.ENVIRONMENT);
        results.add(r);
    }
}
