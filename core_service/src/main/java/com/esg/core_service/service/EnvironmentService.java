package com.esg.core_service.service;

import com.esg.core_service.dto.EnvironmentRequestDto;
import com.esg.core_service.entity.Environment;
import com.esg.core_service.entity.EnvironmentMetric;
import com.esg.core_service.repository.EnvironmentMetricRepository;
import com.esg.core_service.repository.EnvironmentRepository;
import com.esg.core_service.util.EnvironmentFormulaUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnvironmentService {

    private final EnvironmentRepository environmentRepository;
    private final EnvironmentMetricRepository metricRepository;

    public void submitEnvironmentData(UUID companyId, @Valid EnvironmentRequestDto dto) {

//      Save Raw Data
        Environment env = new Environment();
        env.setCompanyId(companyId);
        env.setReportingYear(dto.getReportingYear());
        env.setTotalElectricityKwh(dto.getTotalElectricityKwh());
        env.setOfficeAreaSqm(dto.getOfficeAreaSqm());
        env.setDieselUsedLiters(dto.getDieselUsedLiters());
        env.setRenewableEnergyKwh(dto.getRenewableEnergyKwh());
        env.setDataCenterTotalEnergyKwh(dto.getDataCenterTotalEnergyKwh());
        env.setDataCenterItEnergyKwh(dto.getDataCenterItEnergyKwh());
        env.setTotalWaterLiters(dto.getTotalWaterLiters());
        env.setRecycledWaterLiters(dto.getRecycledWaterLiters());
        env.setTotalEmployees(dto.getTotalEmployees());
        env.setEwasteGenerated(dto.getEwasteGenerated());
        env.setEwasteRecycled(dto.getEwasteRecycled());
        env.setElectricityEmissionFactor(dto.getElectricityEmissionFactor());
        env.setDieselEmissionFactor(dto.getDieselEmissionFactor());
        env.setRainwaterHarvesting(dto.getRainwaterHarvesting());
        env.setCreatedAt(LocalDateTime.now());

        environmentRepository.save(env);


//      Calculate Kpis Value
        float eui = EnvironmentFormulaUtil.eui(
                dto.getTotalElectricityKwh(),
                dto.getOfficeAreaSqm()
        );

        float renewablePercent = EnvironmentFormulaUtil.renewablePercent(
                dto.getRenewableEnergyKwh(),
                dto.getTotalElectricityKwh()
        );

        float pue = EnvironmentFormulaUtil.pue(
                dto.getDataCenterTotalEnergyKwh(),
                dto.getDataCenterItEnergyKwh()
        );

        float waterPerEmployee = EnvironmentFormulaUtil.waterPerEmployee(
                dto.getTotalWaterLiters(),
                dto.getTotalEmployees()
        );

        float recycledWaterPercent = EnvironmentFormulaUtil.recycledWaterPercent(
                dto.getRecycledWaterLiters(),
                dto.getTotalWaterLiters()
        );

        float ewastePercent = EnvironmentFormulaUtil.ewastePercent(
                dto.getEwasteRecycled(),
                dto.getEwasteGenerated()
        );

        float electricityCo2 = EnvironmentFormulaUtil.electricityCo2(
                dto.getTotalElectricityKwh(),
                dto.getElectricityEmissionFactor()
        );

        float dieselCo2 = EnvironmentFormulaUtil.dieselCo2(
                dto.getDieselUsedLiters(),
                dto.getDieselEmissionFactor()
        );

        float totalCo2 = electricityCo2 + dieselCo2;

        float carbonIntensity =
                (totalCo2 * 1000) / dto.getOfficeAreaSqm();

//      Saved Calculated Value
        EnvironmentMetric metric = new EnvironmentMetric();
        metric.setEnvironmentId(env.getEnvironmentId());
        metric.setCompanyId(companyId);
        metric.setReportingYear(dto.getReportingYear());

        metric.setEnergyUseIntensity(eui);
        metric.setRenewableEnergyPercent(renewablePercent);
        metric.setDataCenterPue(pue);
        metric.setWaterPerEmployee(waterPerEmployee);
        metric.setRecycledWaterPercent(recycledWaterPercent);
        metric.setEwasteRecyclingPercent(ewastePercent);

        metric.setElectricityCo2Emission(electricityCo2);
        metric.setDieselCo2Emission(dieselCo2);
        metric.setTotalCo2Emission(totalCo2);
        metric.setCarbonIntensity(carbonIntensity);

        metric.setCalculatedAt(LocalDateTime.now());

        metricRepository.save(metric);

    }
}
