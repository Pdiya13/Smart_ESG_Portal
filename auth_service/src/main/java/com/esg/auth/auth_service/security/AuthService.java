package com.esg.auth.auth_service.security;

import com.esg.auth.auth_service.entity.Admin;
import com.esg.auth.auth_service.dto.*;
import com.esg.auth.auth_service.entity.Company;
import com.esg.auth.auth_service.repository.CompanyRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;


    public LoginResponesDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );

        Object principal = authentication.getPrincipal();
        UserDto userDto;
        String token;

        if (principal instanceof Company company) {
            token = authUtil.generateToken(company);
            userDto = UserDto.builder()
                    .id(company.getId())
                    .email(company.getEmail())
                    .role("ROLE_USER")
                    .companyName(company.getCompanyName())
                    .active(company.isActive())
                    .build();
        } else if (principal instanceof Admin admin) {
            token = authUtil.generateToken(admin);
            userDto = UserDto.builder()
                    .id(admin.getId())
                    .email(admin.getEmail())
                    .role("ROLE_ADMIN")
                    .active(true)
                    .build();
        } else {
            throw new RuntimeException("Unsupported user type");
        }

        return LoginResponesDto.builder()
                .jwt(token)
                .user(userDto)
                .build();
    }
    public SignUpResponseDto signup(SignUpRequestDto signupRequestDto) {
        if (companyRepository.existsByCompanyName(signupRequestDto.getCompanyName())) {
            throw new RuntimeException("Company already exists");
        }

        if (companyRepository.existsByEmail(signupRequestDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Company company = modelMapper.map(signupRequestDto , Company.class);

        company.setPassword(passwordEncoder.encode(signupRequestDto.getPassword()));

        Company savedCompany = companyRepository.save(company);

        CompanyDto companyDto = modelMapper.map(savedCompany , CompanyDto.class);

        return SignUpResponseDto.builder()
                .message("Company saved successfully")
                .company(companyDto)
                .build();
    }



    public CompanyDto update(UUID id, UpdateCompanyRequestDto dto) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (dto.getCompanyName() != null) {
            company.setCompanyName(dto.getCompanyName());
        }

        if (dto.getEmail() != null) {
            company.setEmail(dto.getEmail());
        }

        Company updatedCompany = companyRepository.save(company);

        return modelMapper.map(updatedCompany, CompanyDto.class);
    }

    public String deleteCompany(UUID id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company Not Found"));

        companyRepository.delete(company);

        return "Company account deleted successfully";
    }

    // ---- Admin: Company Management ----

    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(company -> modelMapper.map(company, CompanyDto.class))
                .collect(Collectors.toList());
    }

    public CompanyDto toggleCompanyStatus(UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setActive(!company.isActive());
        Company saved = companyRepository.save(company);

        return modelMapper.map(saved, CompanyDto.class);
    }

    public boolean getCompanyActiveStatus(UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return company.isActive();
    }
}

