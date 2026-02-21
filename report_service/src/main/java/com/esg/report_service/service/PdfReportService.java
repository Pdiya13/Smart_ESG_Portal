package com.esg.report_service.service;

import com.esg.report_service.dto.DashboardResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class PdfReportService {

    public byte[] generatePdf(DashboardResponseDTO dashboard) {

        String content =
                "ESG REPORT\n\n" +
                        "Total Score: " + dashboard.getScore().getTotalEsgScore() + "\n" +
                        "Rating: " + dashboard.getScore().getRating();

        return content.getBytes();
    }
}