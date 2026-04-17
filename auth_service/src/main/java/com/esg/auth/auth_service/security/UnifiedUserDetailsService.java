package com.esg.auth.auth_service.security;

import com.esg.auth.auth_service.repository.AdminRepository;
import com.esg.auth.auth_service.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UnifiedUserDetailsService implements UserDetailsService {

    private final CompanyRepository companyRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Check Admin first
        var admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return admin.get();
        }

        // Check Company second
        return companyRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email)
                );
    }
}
