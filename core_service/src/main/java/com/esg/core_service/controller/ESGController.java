package com.esg.core_service.controller;

import com.esg.core_service.dto.ESGSubmitRequest;
import com.esg.core_service.entity.ESGScore;
import com.esg.core_service.service.ESGScoreService;
import com.esg.core_service.service.EnvironmentService;
import com.esg.core_service.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/esg")
@RequiredArgsConstructor
public class ESGController {

    private final EnvironmentService environmentService;
    private final SocialService socialService;
    private final ESGScoreService esgScoreService;

    @PostMapping("/submit-all")
    public ResponseEntity<ESGScore> submitAll(
            @RequestHeader("X-Company-Id") UUID companyId,
            @RequestBody ESGSubmitRequest request){

        float env = environmentService.submit(companyId, request.getEnvironment());
        float soc = socialService.submit(companyId, request.getSocial());

        // Governance not implemented yet so dummy value
        float gov = 0f;

        ESGScore score = esgScoreService.save(
                companyId,
                request.getEnvironment().getReportingYear(),
                env,
                soc,
                gov
        );

        return ResponseEntity.ok(score);
    }
}