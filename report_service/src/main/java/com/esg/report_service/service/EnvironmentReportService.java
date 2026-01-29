package com.esg.report_service.service;

import com.esg.report_service.dto.EnvironmentMetricInputDTO;
import com.esg.report_service.dto.EnvironmentReportRequestDTO;
import com.esg.report_service.dto.EnvironmentReportResponseDTO;
import com.esg.report_service.entity.EsgKpiResult;
import com.esg.report_service.entity.EsgReport;
import com.esg.report_service.entity.KpiStatus;
import com.esg.report_service.repository.EsgKpiResultRepository;
import com.esg.report_service.repository.EsgReportRepository;
import com.esg.report_service.util.EnvironmentBenchmarkConstants;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnvironmentReportService {

    private final EsgReportRepository reportRepo;
    private final EsgKpiResultRepository kpiRepo;
    private final ModelMapper modelMapper;

    @Transactional
    public EnvironmentReportResponseDTO generateEnvironmentReport(UUID companyId, EnvironmentReportRequestDTO request)
    {

        EnvironmentMetricInputDTO m = request.getMetrics();

        int score = 0;
        List<EsgKpiResult> kpiResults = new ArrayList<>();

        score += checkLess("EUI", m.getEnergyUseIntensity(),
                EnvironmentBenchmarkConstants.EUI_MAX, kpiResults);

        score += checkGreater("Renewable Energy %",
                m.getRenewableEnergyPercent(),
                EnvironmentBenchmarkConstants.RENEWABLE_MIN, kpiResults);

        score += checkLess("PUE", m.getDataCenterPue(),
                EnvironmentBenchmarkConstants.PUE_MAX, kpiResults);

        score += checkLess("Water per Employee",
                m.getWaterPerEmployee(),
                EnvironmentBenchmarkConstants.WATER_MAX, kpiResults);

        score += checkGreater("E-waste Recycling %",
                m.getEwasteRecyclingPercent(),
                EnvironmentBenchmarkConstants.EWASTE_MIN, kpiResults);

        score += checkLess("Carbon Intensity",
                m.getCarbonIntensity(),
                EnvironmentBenchmarkConstants.CARBON_MAX, kpiResults);

        int environmentScore = score / 6;

        EsgReport report = new EsgReport();
        report.setCompanyId(companyId);
        report.setReportingYear(request.getReportingYear());
        report.setEnvironmentScore(environmentScore);
        report.setTotalEsgScore(environmentScore);

        EsgReport savedReport = reportRepo.save(report);

        for (EsgKpiResult kpi : kpiResults) {
            kpi.setReport(savedReport);
        }
        kpiRepo.saveAll(kpiResults);

        savedReport.setKpiResults(kpiResults);

        return modelMapper.map(savedReport, EnvironmentReportResponseDTO.class);
    }

    private int checkLess(String kpi, Float actual, Float benchmark, List<EsgKpiResult> list)
    {
        boolean pass = actual <= benchmark;
        list.add(createResult(kpi, actual, benchmark, pass));
        return pass ? 100 : 0;
    }

    private int checkGreater(String kpi, Float actual, Float benchmark, List<EsgKpiResult> list)
    {
        boolean pass = actual >= benchmark;
        list.add(createResult(kpi, actual, benchmark, pass));
        return pass ? 100 : 0;
    }

    private EsgKpiResult createResult(String kpi, Float actual, Float benchmark, boolean pass)
    {
        EsgKpiResult result = new EsgKpiResult();
        result.setKpiName(kpi);
        result.setActualValue(actual);
        result.setBenchmarkValue(benchmark);
        result.setStatus(pass ? KpiStatus.PASS : KpiStatus.FAIL);
        return result;
    }
}
