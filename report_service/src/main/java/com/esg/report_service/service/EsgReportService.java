package com.esg.report_service.service;

import com.esg.report_service.client.CoreServiceClient;
import com.esg.report_service.dto.ApiResponse;
import com.esg.report_service.dto.EsgReportRequestDTO;
import com.esg.report_service.dto.EsgReportResponseDTO;
import com.esg.report_service.dto.EsgScoreSummaryResponseDTO;
import com.esg.report_service.entity.EsgReport;
import com.esg.report_service.repository.EsgReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.esg.report_service.entity.EsgPillar;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EsgReportService {

    private final CoreServiceClient coreServiceClient;
    private final EsgReportRepository esgReportRepository;

    public ApiResponse<EsgReportResponseDTO> generateReport(
            UUID companyId,
            EsgReportRequestDTO request
    ) {

        Integer year = request.getReportingYear();
        EsgPillar pillar = request.getPillar();

        Object coreData;

        switch (pillar) {
            case ENVIRONMENT ->
                    coreData = coreServiceClient.getEnvironmentData(companyId, year).block();

            case SOCIAL ->
                    coreData = coreServiceClient.getSocialData(companyId, year).block();

            case GOVERNANCE ->
                    coreData = coreServiceClient.getGovernanceData(companyId, year).block();

            default -> throw new RuntimeException("Invalid pillar");
        }

        if (coreData == null) {
            throw new RuntimeException("No data found in Core for this year");
        }

        int score = 80; // dummy score

        EsgReport report = esgReportRepository
                .findByCompanyIdAndReportingYear(companyId, year)
                .orElse(new EsgReport());

        report.setCompanyId(companyId);
        report.setReportingYear(year);

        switch (pillar) {
            case ENVIRONMENT -> report.setEnvironmentScore(score);
            case SOCIAL -> report.setSocialScore(score);
            case GOVERNANCE -> report.setGovernanceScore(score);
        }

        Integer env = report.getEnvironmentScore() == null ? 0 : report.getEnvironmentScore();
        Integer soc = report.getSocialScore() == null ? 0 : report.getSocialScore();
        Integer gov = report.getGovernanceScore() == null ? 0 : report.getGovernanceScore();

        report.setTotalEsgScore(env + soc + gov);

        esgReportRepository.save(report);

        // response
        EsgReportResponseDTO response = new EsgReportResponseDTO();
        response.setCompanyId(companyId);
        response.setReportingYear(year);
        response.setEnvironmentScore(report.getEnvironmentScore());
        response.setSocialScore(report.getSocialScore());
        response.setGovernanceScore(report.getGovernanceScore());
        response.setTotalEsgScore(report.getTotalEsgScore());

        ApiResponse<EsgReportResponseDTO> api = new ApiResponse<>();
        api.setSuccess(true);
        api.setMessage("Report generated successfully");
        api.setData(response);

        return api;
    }

    public ApiResponse<EsgScoreSummaryResponseDTO> getEsgScoreSummary(
            UUID companyId,
            Integer reportingYear
    ) {

        EsgReport report = esgReportRepository
                .findByCompanyIdAndReportingYear(companyId, reportingYear)
                .orElseThrow(() ->
                        new RuntimeException("ESG report not found"));

        EsgScoreSummaryResponseDTO response = new EsgScoreSummaryResponseDTO();
        response.setCompanyId(companyId);
        response.setReportingYear(reportingYear);
        response.setEnvironmentScore(report.getEnvironmentScore());
        response.setSocialScore(report.getSocialScore());
        response.setGovernanceScore(report.getGovernanceScore());
        response.setTotalEsgScore(report.getTotalEsgScore());

        ApiResponse<EsgScoreSummaryResponseDTO> api = new ApiResponse<>();
        api.setSuccess(true);
        api.setMessage("Score summary fetched successfully");
        api.setData(response);

        return api;
    }
}