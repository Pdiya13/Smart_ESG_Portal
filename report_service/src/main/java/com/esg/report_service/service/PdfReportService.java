package com.esg.report_service.service;

import com.esg.report_service.dto.DashboardResponseDTO;
import com.esg.report_service.dto.MetricBreakdownDTO;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceGray;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
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

            document.setMargins(50, 50, 50, 50);

            // Title
            document.add(new Paragraph("ESG SUSTAINABILITY REPORT")
                    .setBold()
                    .setFontSize(20)
                    .setTextAlignment(TextAlignment.LEFT)
                    .setMarginBottom(5));

            document.add(new Paragraph("Company: TCS") // Hardcoded for now as per user request example
                    .setFontSize(12)
                    .setFontColor(ColorConstants.DARK_GRAY));

            if (dashboard.getScore() != null && dashboard.getScore().getReportingYear() != null) {
                document.add(new Paragraph("Reporting Year: " + dashboard.getScore().getReportingYear())
                        .setFontSize(12)
                        .setFontColor(ColorConstants.DARK_GRAY)
                        .setMarginBottom(20));
            } else {
                document.add(new Paragraph("\n"));
            }

            // Summary Section
            if (dashboard.getScore() != null) {
                document.add(new Paragraph("Summary")
                        .setBold()
                        .setFontSize(14)
                        .setMarginBottom(10)
                        .setBorderBottom(new SolidBorder(ColorConstants.LIGHT_GRAY, 1)));
                
                Table summaryTable = new Table(UnitValue.createPercentArray(new float[] { 30, 70 }))
                        .useAllAvailableWidth()
                        .setMarginBottom(20);
                
                addCleanCell(summaryTable, "Total ESG Score", String.valueOf(dashboard.getScore().getTotalEsgScore()));
                addCleanCell(summaryTable, "Rating", dashboard.getScore().getRating() != null ? dashboard.getScore().getRating() : "N/A");
                document.add(summaryTable);
            } else {
                document.add(new Paragraph("No summary data available").setItalic().setFontColor(ColorConstants.GRAY));
            }

            // Metrics Breakdown
            if (dashboard.getMetrics() != null) {
                MetricBreakdownDTO metrics = dashboard.getMetrics();

                document.add(new Paragraph("Detailed Metrics")
                        .setBold()
                        .setFontSize(14)
                        .setMarginBottom(10)
                        .setBorderBottom(new SolidBorder(ColorConstants.LIGHT_GRAY, 1)));

                // Environment
                addMetricTable(document, "Environment", (Map<String, Object>) metrics.getEnvironmentMetrics());
                
                // Social
                addMetricTable(document, "Social", (Map<String, Object>) metrics.getSocialMetrics());
                
                // Governance
                addMetricTable(document, "Governance", (Map<String, Object>) metrics.getGovernanceMetrics());
            } else {
                document.add(new Paragraph("Detailed metrics breakdown not available").setItalic().setFontColor(ColorConstants.GRAY));
            }

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            System.err.println("Critical PDF generation error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("PDF generation failed: " + e.getMessage(), e);
        }
    }

    private void addCleanCell(Table table, String label, String value) {
        Cell labelCell = new Cell().add(new Paragraph(label).setFontColor(ColorConstants.DARK_GRAY))
                .setBorder(Border.NO_BORDER)
                .setPadding(5);
        Cell valueCell = new Cell().add(new Paragraph(value).setBold())
                .setBorder(Border.NO_BORDER)
                .setPadding(5);
        
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void addMetricTable(Document document, String title, Map<String, Object> dataMap) {
        document.add(new Paragraph(title).setBold().setFontSize(12).setMarginTop(10).setMarginBottom(5));

        if (dataMap == null || dataMap.isEmpty()) {
            document.add(new Paragraph("No data available").setItalic().setFontColor(ColorConstants.GRAY).setMarginBottom(10));
            return;
        }

        Table table = new Table(UnitValue.createPercentArray(new float[] { 70, 30 })).useAllAvailableWidth().setMarginBottom(15);
        
        Border lightBorder = new SolidBorder(new DeviceGray(0.9f), 1f);

        for (Map.Entry<String, Object> entry : dataMap.entrySet()) {
            String key = entry.getKey();
            // Skip internal fields
            if (key.contains("id") || key.contains("Id") || key.equals("calculatedAt") || key.equals("reportingYear")
                    || key.equals("companyId")) {
                continue;
            }

            Cell cell1 = new Cell().add(new Paragraph(formatKey(key)).setFontSize(10).setFontColor(ColorConstants.DARK_GRAY))
                    .setBorder(Border.NO_BORDER)
                    .setBorderBottom(lightBorder)
                    .setPadding(8);
            
            Cell cell2 = new Cell().add(new Paragraph(String.valueOf(entry.getValue())).setFontSize(10).setBold())
                    .setBorder(Border.NO_BORDER)
                    .setBorderBottom(lightBorder)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setPadding(8);

            table.addCell(cell1);
            table.addCell(cell2);
        }
        document.add(table);
    }

    private String formatKey(String key) {
        return key.replaceAll("([a-z])([A-Z])", "$1 $2")
                .replaceFirst("^.", key.substring(0, 1).toUpperCase());
    }
}