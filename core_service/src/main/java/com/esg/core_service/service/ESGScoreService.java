package com.esg.core_service.service;

import com.esg.core_service.entity.ESGScore;
import com.esg.core_service.repository.ESGScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ESGScoreService {

    private final ESGScoreRepository repository;

    public ESGScore save(UUID companyId, int year, float env, float soc, float gov){

        float total = (env + soc + gov) / 3;

        String rating =
                total >= 80 ? "A" :
                        total >= 60 ? "B" : "C";

        ESGScore s = new ESGScore();
        s.setCompanyId(companyId);
        s.setReportingYear(year);
        s.setEnvironmentScore(env);
        s.setSocialScore(soc);
        s.setGovernanceScore(gov);
        s.setTotalEsgScore(total);
        s.setRating(rating);
        s.setCalculatedAt(LocalDateTime.now());

        return repository.save(s);
    }
}