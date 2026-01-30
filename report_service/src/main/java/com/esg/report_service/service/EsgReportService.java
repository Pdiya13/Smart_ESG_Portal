package com.esg.report_service.service;

import com.esg.report_service.dto.*;
import com.esg.report_service.entity.EsgKpiResult;
import com.esg.report_service.entity.EsgPillar;
import com.esg.report_service.entity.EsgReport;
import com.esg.report_service.entity.KpiStatus;
import com.esg.report_service.repository.EsgReportRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EsgReportService {

    private final EsgReportRepository repository;
    private final EnvironmentReportService environmentService;
    private final SocialReportService socialService;
    private final GovernanceReportService governanceService;
    private final ModelMapper modelMapper;

    public ApiResponse<EsgReportResponseDTO> generateReport(UUID companyId, EsgReportRequestDTO request)
    {
        EsgReport report = repository
                .findByCompanyIdAndReportingYear(companyId, request.getReportingYear())
                .orElseGet(() -> {
                    EsgReport r = new EsgReport();
                    r.setCompanyId(companyId);
                    r.setReportingYear(request.getReportingYear());
                    r.setKpiResults(new ArrayList<>());
                    return r;
                });

        report.getKpiResults()
                .removeIf(k -> k.getPillar() == request.getPillar());

        List<EsgKpiResult> newResults = new ArrayList<>();

        switch (request.getPillar())
        {
            case ENVIRONMENT ->
                    environmentService.evaluate(
                            (EnvironmentMetricInputDTO) request.getMetrics(),
                            report,
                            newResults
                    );

            case SOCIAL ->
                    socialService.evaluate(
                            (SocialMetricInputDTO) request.getMetrics(),
                            report,
                            newResults
                    );

            case GOVERNANCE ->
                    governanceService.evaluate(
                            (GovernanceMetricInputDTO) request.getMetrics(),
                            report,
                            newResults
                    );
        }

        report.getKpiResults().addAll(newResults);

        int pillarScore = calculateScore(newResults);
        setScore(report, request.getPillar(), pillarScore);

        report.setTotalEsgScore(calculateTotalEsgScore(report));

        repository.save(report);

        return new ApiResponse<>(
                true,
                "ESG report generated successfully",
                mapToResponse(report)
        );
    }

    private int calculateScore(List<EsgKpiResult> results)
    {
        int total = 0;
        for (EsgKpiResult r : results)
        {
            total += (r.getStatus() == KpiStatus.PASS) ? 100 : 0;
        }
        return results.isEmpty() ? 0 : total / results.size();
    }

    private int calculateTotalEsgScore(EsgReport report)
    {
        int total = 0;
        int count = 0;

        if (report.getEnvironmentScore() != null)
        {
            total += report.getEnvironmentScore();
            count++;
        }
        if (report.getSocialScore() != null)
        {
            total += report.getSocialScore();
            count++;
        }
        if (report.getGovernanceScore() != null)
        {
            total += report.getGovernanceScore();
            count++;
        }
        return count == 0 ? 0 : total / count;
    }

    private void setScore(EsgReport report, EsgPillar pillar, int score)
    {
        switch (pillar)
        {
            case ENVIRONMENT -> report.setEnvironmentScore(score);
            case SOCIAL -> report.setSocialScore(score);
            case GOVERNANCE -> report.setGovernanceScore(score);
        }
    }

    private EsgReportResponseDTO mapToResponse(EsgReport report)
    {
        EsgReportResponseDTO dto =
                modelMapper.map(report, EsgReportResponseDTO.class);

        List<KpiResultResponseDTO> kpis = new ArrayList<>();
        for (EsgKpiResult r : report.getKpiResults()) {
            kpis.add(modelMapper.map(r, KpiResultResponseDTO.class));
        }

        dto.setKpiResults(kpis);
        return dto;
    }
}

