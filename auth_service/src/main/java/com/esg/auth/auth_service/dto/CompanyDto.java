package com.esg.auth.auth_service.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class CompanyDto {
    private UUID id;
    private String companyName;
    private String cin;
    private String email;
    private boolean active;
    private Instant createdAt;
}
