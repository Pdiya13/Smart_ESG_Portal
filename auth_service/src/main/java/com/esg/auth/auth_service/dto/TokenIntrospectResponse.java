package com.esg.auth.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenIntrospectResponse {

    private boolean valid;
    private String companyId;
}