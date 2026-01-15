package com.esg.core_service.service;

import com.esg.core_service.dto.SocialRequestDto;
import com.esg.core_service.entity.Social;
import com.esg.core_service.entity.SocialMetric;
import com.esg.core_service.repository.SocialMetricRepository;
import com.esg.core_service.repository.SocialRepository;
import com.esg.core_service.util.SocialFormulaUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final SocialRepository socialRepository;
    private final SocialMetricRepository metricRepository;
    private final ModelMapper mapper;

    public void submit(UUID companyId, SocialRequestDto dto) {

        Social s = mapper.map(dto, Social.class);
        s.setCompanyId(companyId);
        s.setCreatedAt(LocalDateTime.now());

        Social saved = socialRepository.save(s);

        SocialMetric metric = SocialFormulaUtil.calculateAll(saved);
        metricRepository.save(metric);
    }
}