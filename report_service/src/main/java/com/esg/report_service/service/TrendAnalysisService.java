package com.esg.report_service.service;

import com.esg.report_service.dto.EsgScoreDTO;
import com.esg.report_service.dto.TrendDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TrendAnalysisService {

    public List<TrendDTO> calculateTrends(List<EsgScoreDTO> scores) {

        List<TrendDTO> trends = new ArrayList<>();

        if (scores == null || scores.size() < 2) {
            return trends;
        }

        for (int i = 1; i < scores.size(); i++) {

            EsgScoreDTO previous = scores.get(i - 1);
            EsgScoreDTO current = scores.get(i);

            Float previousScore = previous.getTotalEsgScore();
            Float currentScore = current.getTotalEsgScore();

            Float growth = ((currentScore - previousScore) / previousScore) * 100;

            String direction;

            if (growth > 0.5) {
                direction = "UP";
            } else if (growth < -0.5) {
                direction = "DOWN";
            } else {
                direction = "STABLE";
            }

            trends.add(
                    new TrendDTO(
                            previous.getReportingYear(),
                            current.getReportingYear(),
                            direction,
                            Math.round(growth * 100f) / 100f
                    )
            );
        }

        return trends;
    }
}