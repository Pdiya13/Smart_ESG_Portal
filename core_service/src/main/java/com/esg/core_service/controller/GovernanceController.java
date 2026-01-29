package com.esg.core_service.controller;

import com.esg.core_service.dto.GovernanceRequestDto;
import com.esg.core_service.service.GovernanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/governance/submit")
@RequiredArgsConstructor
public class GovernanceController {

    private final GovernanceService governanceService;

    @PostMapping
    public ResponseEntity<String> submitGovernance(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody GovernanceRequestDto dto
    ) {
        governanceService.submit(companyId, dto);
        return ResponseEntity.ok("Governance data submitted successfully");
    }
}