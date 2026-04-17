package com.esg.auth.auth_service.security;

import com.esg.auth.auth_service.entity.Company;
import com.esg.auth.auth_service.entity.Admin;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Component
public class AuthUtil {

    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private SecretKey getSecretkey()
    {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }



    public String generateToken(UserDetails user) {
        String userId = "";
        String role = "";

        if (user instanceof Company company) {
            userId = company.getId().toString();
            role = "ROLE_USER";
        } else if (user instanceof Admin admin) {
            userId = admin.getId().toString();
            role = "ROLE_ADMIN";
        }

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSecretkey())
                .compact();
    }

    public UUID extractUserId(String token) {
        String userId = Jwts.parser()
                .verifyWith(getSecretkey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("userId", String.class);

        return UUID.fromString(userId);
    }

    public String extractRole(String token) {
        return Jwts.parser()
                .verifyWith(getSecretkey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }
}
