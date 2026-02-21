package com.esg.report_service.service;

import com.esg.report_service.dto.EsgScoreDTO;
import com.esg.report_service.dto.RecommendationDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    public List<RecommendationDTO> generate(EsgScoreDTO score) {

        List<RecommendationDTO> list = new ArrayList<>();

        if (score.getEnvironmentScore() < 70) {
            list.add(new RecommendationDTO("Improve renewable energy usage"));
        }

        if (score.getSocialScore() < 70) {
            list.add(new RecommendationDTO("Increase employee satisfaction programs"));
        }

        if (score.getGovernanceScore() < 70) {
            list.add(new RecommendationDTO("Strengthen board independence"));
        }

        return list;
    }
}