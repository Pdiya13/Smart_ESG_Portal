package com.esg.auth.auth_service.dto;

import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private UUID id;
    private String email;
    private String role;
    private String companyName; // Optional, only for companies
    private Boolean active; // true for admins, actual value for companies
}
