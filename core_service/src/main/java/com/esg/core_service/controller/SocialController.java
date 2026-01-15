package com.esg.core_service.controller;

import com.esg.core_service.dto.SocialRequestDto;
import com.esg.core_service.service.SocialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/social")
@RequiredArgsConstructor
public class SocialController {

    private final SocialService service;

    @PostMapping("/submit")
    public ResponseEntity<String> submit(
            @RequestHeader("X-Company-Id") UUID companyId,
            @Valid @RequestBody SocialRequestDto dto) {

        service.submit(companyId, dto);
        return ResponseEntity.ok("Social data submitted");
    }
}