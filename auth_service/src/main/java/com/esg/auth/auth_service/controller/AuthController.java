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
                                                    @Valid @RequestBody UpdateCompanyRequestDto updateCompanyRequestDto) {
        String token = authHeader.replace("Bearer ", "");
        UUID id = authUtil.extractCompanyId(token);

        return ResponseEntity.ok(authService.update(id, updateCompanyRequestDto));

    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteCompany(@RequestHeader("Authorization") String authHeader)
    {
        String token = authHeader.substring(7);
        UUID companyId = authUtil.extractCompanyId(token);

        return ResponseEntity.ok(authService.deleteCompany(companyId));

    }

    @PostMapping("/token/introspect")
    public ResponseEntity<TokenIntrospectResponse> introspect(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(
                    new TokenIntrospectResponse(false, null)
            );
        }

        String token = authHeader.substring(7);

        try {
            UUID companyId = authUtil.extractCompanyId(token);

            return ResponseEntity.ok(
                    new TokenIntrospectResponse(true, companyId.toString())
            );

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new TokenIntrospectResponse(false, null)
            );
        }
    }
}
