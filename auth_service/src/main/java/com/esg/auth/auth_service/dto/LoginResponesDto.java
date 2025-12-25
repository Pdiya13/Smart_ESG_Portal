package com.esg.auth.auth_service.dto;

import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponesDto {
    private String jwt;
    private CompanyDto company;
}
