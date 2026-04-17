package com.esg.auth.auth_service.controller;

import com.esg.auth.auth_service.dto.*;
import com.esg.auth.auth_service.security.AuthService;
import com.esg.auth.auth_service.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        UUID id = authUtil.extractUserId(token);

        return ResponseEntity.ok(authService.update(id, updateCompanyRequestDto));

    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteCompany(@RequestHeader("Authorization") String authHeader)
    {
        String token = authHeader.substring(7);
        UUID userId = authUtil.extractUserId(token);

        return ResponseEntity.ok(authService.deleteCompany(userId));

    }

    @PostMapping("/token/introspect")
    public ResponseEntity<TokenIntrospectResponse> introspect(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(
                    new TokenIntrospectResponse(false, null, null)
            );
        }

        String token = authHeader.substring(7);

        try {
            UUID userId = authUtil.extractUserId(token);
            String role = authUtil.extractRole(token);

            return ResponseEntity.ok(
                    new TokenIntrospectResponse(true, userId.toString(), role)
            );

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new TokenIntrospectResponse(false, null, null)
            );
        }
    }

    // ---- Admin: Company Management Endpoints ----

    @GetMapping("/admin/companies")
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        return ResponseEntity.ok(authService.getAllCompanies());
    }

    @PutMapping("/admin/companies/{id}/toggle")
    public ResponseEntity<CompanyDto> toggleCompanyStatus(@PathVariable UUID id) {
        return ResponseEntity.ok(authService.toggleCompanyStatus(id));
    }

    @GetMapping("/status")
    public ResponseEntity<?> getAccountStatus(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            UUID userId = authUtil.extractUserId(token);
            String role = authUtil.extractRole(token);

            // Admins are always active
            if ("ROLE_ADMIN".equals(role)) {
                return ResponseEntity.ok(java.util.Map.of("active", true));
            }

            boolean active = authService.getCompanyActiveStatus(userId);
            return ResponseEntity.ok(java.util.Map.of("active", active));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of("active", true));
        }
    }
}

