package com.esg.auth.auth_service.security;

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

import java.util.UUID;

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

        Company company = (Company) authentication.getPrincipal();

        String token = authUtil.generateToken(company);

        CompanyDto companyDto = modelMapper.map(company , CompanyDto.class);

        return LoginResponesDto.builder()
                .jwt(token)
                .company(companyDto)
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
}
