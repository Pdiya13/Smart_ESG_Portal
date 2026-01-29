package com.esg.core_service.controller;

import com.esg.core_service.dto.ESGSubmitRequest;
import com.esg.core_service.entity.ESGScore;
import com.esg.core_service.service.ESGScoreService;
import com.esg.core_service.service.EnvironmentService;
import com.esg.core_service.service.GovernanceService;
import com.esg.core_service.service.SocialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/submit-all")
@RequiredArgsConstructor
public class ESGController {

    private final EnvironmentService environmentService;
    private final SocialService socialService;
    private final GovernanceService governanceService;
    private final ESGScoreService esgScoreService;

    @PostMapping
    public ResponseEntity<ESGScore> submitAll(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody ESGSubmitRequest request) {

        int reportingYear = request.getEnvironment().getReportingYear();

        float env = environmentService.submit(companyId, request.getEnvironment());
        float soc = socialService.submit(companyId, request.getSocial());
        float gov = governanceService.submit(companyId, request.getGovernance());

        ESGScore score = esgScoreService.save(
                companyId,
                reportingYear,
                env,
                soc,
                gov
        );

        return ResponseEntity.ok(score);
    }
}