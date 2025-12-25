package com.esg.auth.auth_service.repository;

import com.esg.auth.auth_service.entity.Company;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.OptionalInt;
import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, UUID> {
    Optional<Company> findByCompanyName(String companyName);

    boolean existsByCompanyName(String companyName);
    boolean existsByEmail(@Email String email);

}