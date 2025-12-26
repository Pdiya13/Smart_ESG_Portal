package com.esg.auth.auth_service.controller;

import com.esg.auth.auth_service.dto.*;
import com.esg.auth.auth_service.security.AuthService;
import com.esg.auth.auth_service.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthUtil authUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponesDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto)
    {
        return ResponseEntity.ok(authService.login(loginRequestDto));
    }

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signup(@Valid @RequestBody SignUpRequestDto signupRequestDto)
    {
        return ResponseEntity.ok(authService.signup(signupRequestDto));
    }

    @PutMapping("/update")
    public ResponseEntity<CompanyDto> upadteCompany(@RequestHeader("Authorization") String authHeader,
                                                    @Valid @RequestBody UpdateCompanyRequestDto updateCompanyRequestDto)
    {
        String token = authHeader.replace("Bearer ", "");
        UUID id = authUtil.extractCompanyId(token);

        return ResponseEntity.ok(authService.update(id, updateCompanyRequestDto));
    }
}
