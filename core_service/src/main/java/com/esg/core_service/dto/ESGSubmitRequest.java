package com.esg.core_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ESGSubmitRequest {

    @NotNull
    @Valid
    private EnvironmentRequestDto environment;

    @NotNull
    @Valid
    private SocialRequestDto social;

    @NotNull
    @Valid
    private GovernanceRequestDto governance;

}