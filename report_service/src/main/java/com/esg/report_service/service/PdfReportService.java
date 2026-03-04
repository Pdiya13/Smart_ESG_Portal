package com.esg.report_service.service;

import com.esg.report_service.dto.DashboardResponseDTO;
import com.esg.report_service.dto.MetricBreakdownDTO;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Map;

@Service
public class PdfReportService {

    public byte[] generatePdf(DashboardResponseDTO dashboard) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);

            // Title
            document.add(new Paragraph("ESG SUSTAINABILITY REPORT")
                    .setBold()
                    .setFontSize(22)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10));

            document.add(new Paragraph("Company: TCS") // Hardcoded for now as per user request example
                    .setBold()
                    .setFontSize(14));

            if (dashboard.getScore() != null && dashboard.getScore().getReportingYear() != null) {
                document.add(new Paragraph("Reporting Year: " + dashboard.getScore().getReportingYear())
                        .setFontSize(12));
            }

            document.add(new Paragraph("\n"));

            // Summary Section
            if (dashboard.getScore() != null) {
                document.add(new Paragraph("Summary").setBold().setFontSize(16));
                Table summaryTable = new Table(UnitValue.createPercentArray(new float[] { 50, 50 }))
                        .useAllAvailableWidth();
                summaryTable.addCell(new Cell().add(new Paragraph("Total ESG Score").setBold()));
                summaryTable.addCell(
                        new Cell().add(new Paragraph(String.valueOf(dashboard.getScore().getTotalEsgScore()))));
                summaryTable.addCell(new Cell().add(new Paragraph("Rating").setBold()));
                summaryTable.addCell(new Cell().add(new Paragraph(
                        dashboard.getScore().getRating() != null ? dashboard.getScore().getRating() : "N/A")));
                document.add(summaryTable);
            } else {
                document.add(new Paragraph("No summary data available").setItalic());
            }

            document.add(new Paragraph("\n"));

            // Metrics Breakdown
            if (dashboard.getMetrics() != null) {
                MetricBreakdownDTO metrics = dashboard.getMetrics();

                // Environment
                addMetricTable(document, "Environment Metrics", (Map<String, Object>) metrics.getEnvironmentMetrics());
                document.add(new Paragraph("\n"));

                // Social
                addMetricTable(document, "Social Metrics", (Map<String, Object>) metrics.getSocialMetrics());
                document.add(new Paragraph("\n"));

                // Governance
                addMetricTable(document, "Governance Metrics", (Map<String, Object>) metrics.getGovernanceMetrics());
            } else {
                document.add(new Paragraph("Detailed metrics breakdown not available").setItalic());
            }

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            System.err.println("Critical PDF generation error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("PDF generation failed: " + e.getMessage(), e);
        }
    }

    private void addMetricTable(Document document, String title, Map<String, Object> dataMap) {
        document.add(new Paragraph(title).setBold().setFontSize(14).setMarginBottom(5));

        if (dataMap == null || dataMap.isEmpty()) {
            document.add(new Paragraph("No data available for this section").setItalic());
            return;
        }

        Table table = new Table(UnitValue.createPercentArray(new float[] { 60, 40 })).useAllAvailableWidth();
        table.addCell(new Cell().add(new Paragraph("Metric").setBold()));
        table.addCell(new Cell().add(new Paragraph("Value").setBold()));

        for (Map.Entry<String, Object> entry : dataMap.entrySet()) {
            String key = entry.getKey();
            // Skip internal fields
            if (key.contains("id") || key.contains("Id") || key.equals("calculatedAt") || key.equals("reportingYear")
                    || key.equals("companyId")) {
                continue;
            }

            table.addCell(new Cell().add(new Paragraph(formatKey(key))));
            table.addCell(new Cell().add(new Paragraph(String.valueOf(entry.getValue()))));
        }
        document.add(table);
    }

    private String formatKey(String key) {
        return key.replaceAll("([a-z])([A-Z])", "$1 $2")
                .replaceFirst("^.", key.substring(0, 1).toUpperCase());
    }
}