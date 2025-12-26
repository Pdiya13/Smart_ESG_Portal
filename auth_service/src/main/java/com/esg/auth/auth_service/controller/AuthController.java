package com.esg.auth.auth_service.controller;

import com.esg.auth.auth_service.dto.LoginRequestDto;
import com.esg.auth.auth_service.dto.LoginResponesDto;
import com.esg.auth.auth_service.dto.SignUpRequestDto;
import com.esg.auth.auth_service.dto.SignUpResponseDto;
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
    public ResponseEntity<LoginResponesDto> login(@RequestBody LoginRequestDto loginRequestDto)
    {
        return ResponseEntity.ok(authService.login(loginRequestDto));
    }

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signup(@Valid @RequestBody SignUpRequestDto signupRequestDto)
    {
        return ResponseEntity.ok(authService.signup(signupRequestDto));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteCompany(@RequestHeader("Authorization") String authHeader)
    {
        String token = authHeader.substring(7);
        UUID companyId = authUtil.extractCompanyId(token);

        return ResponseEntity.ok(authService.deleteCompany(companyId));
    }
}
