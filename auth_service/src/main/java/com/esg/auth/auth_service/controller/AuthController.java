package com.esg.auth.auth_service.controller;

import com.esg.auth.auth_service.dto.LoginRequestDto;
import com.esg.auth.auth_service.dto.LoginResponesDto;
import com.esg.auth.auth_service.dto.SignUpRequestDto;
import com.esg.auth.auth_service.dto.SignUpResponseDto;
import com.esg.auth.auth_service.security.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

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


}
