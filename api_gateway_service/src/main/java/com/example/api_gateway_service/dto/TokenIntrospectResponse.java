package com.example.api_gateway_service.dto;

public class TokenIntrospectResponse {

    private boolean valid;
    private String companyId;
    private String role;

    public boolean isValid() {
        return valid;
    }

    public String getCompanyId() {
        return companyId;
    }

    public String getRole() {
        return role;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public void setRole(String role) {
        this.role = role;
    }
}