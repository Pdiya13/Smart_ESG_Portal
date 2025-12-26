package com.esg.auth.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCompanyRequestDto {

    private String companyName;

    @Email(message = "Email is not valid")
    private String email;
}
