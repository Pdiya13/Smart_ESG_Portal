package com.esg.auth.auth_service.security;

import com.esg.auth.auth_service.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomCompanyDetailsService implements UserDetailsService {

    private final CompanyRepository companyRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return companyRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Company not found with name: " + email)
                );
    }
}
