package com.esg.auth.auth_service.config;

import com.esg.auth.auth_service.entity.Admin;
import com.esg.auth.auth_service.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@esg.com";
        String adminPassword = "admin@123";

        if (!adminRepository.existsByEmail(adminEmail)) {
            Admin admin = Admin.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role("ROLE_ADMIN")
                    .build();

            adminRepository.save(admin);
            log.info("Default admin created with email: {}", adminEmail);
        } else {
            log.info("Admin already exists, skipping initialization.");
        }
    }
}
