package com.esg.core_service.util;

import com.esg.core_service.entity.Environment;
import com.esg.core_service.entity.EnvironmentMetric;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@NoArgsConstructor
public class EnvironmentFormulaUtil {

    // Energy Use Intensity = electricity / office area
    public static float eui(float totalElectricityKwh, float officeAreaSqm) {
        return totalElectricityKwh / officeAreaSqm;
    }

    // Renewable Energy % = (renewable / total) * 100
    public static float renewablePercent(float renewableEnergyKwh, float totalElectricityKwh) {
        return (renewableEnergyKwh / totalElectricityKwh) * 100;
    }

    // Data Center PUE = total energy / IT energy
    public static float pue(float totalEnergy, float itEnergy) {
        return totalEnergy / itEnergy;
    }

    // Water per employee (L/day) = water / (employees * 365)
    public static float waterPerEmployee(float totalWaterLiters, int totalEmployees) {
        return totalWaterLiters / (totalEmployees * 365);
    }

    // Recycled Water % = (recycled / total) * 100
    public static float recycledWaterPercent(float recycledWater, float totalWater) {
        return (recycledWater / totalWater) * 100;
    }

    // E-waste recycling % = (recycled / generated) * 100
    public static float ewastePercent(float ewasteRecycled, float ewasteGenerated) {
        return (ewasteRecycled / ewasteGenerated) * 100;
    }

    // Electricity CO2 (tons) = (kWh * factor) / 1000
    public static float electricityCo2(float electricityKwh, float emissionFactor) {
        return (electricityKwh * emissionFactor) / 1000;
    }

    // Diesel CO2 (tons) = (liters * factor) / 1000
    public static float dieselCo2(float dieselLiters, float emissionFactor) {
        return (dieselLiters * emissionFactor) / 1000;
    }


    // AUTO KPI CALCULATION FROM ENTITY
    public static EnvironmentMetric calculateAll(Environment env) {

        float eui = env.getTotalElectricityKwh() / env.getOfficeAreaSqm();
        float renewable = (env.getRenewableEnergyKwh() / env.getTotalElectricityKwh()) * 100;
        float pue = env.getDataCenterTotalEnergyKwh() / env.getDataCenterItEnergyKwh();
        float water = env.getTotalWaterLiters() / (env.getTotalEmployees() * 365f);
        float ewaste = (env.getEwasteRecycled() / env.getEwasteGenerated()) * 100;

        float elecCo2 = (env.getTotalElectricityKwh() * env.getElectricityEmissionFactor()) / 1000;
        float dieselCo2 = (env.getDieselUsedLiters() * env.getDieselEmissionFactor()) / 1000;
        float totalCo2 = elecCo2 + dieselCo2;
        float carbon = (totalCo2 * 1000) / env.getOfficeAreaSqm();
        float recycledWaterPercent =
                (env.getRecycledWaterLiters() / env.getTotalWaterLiters()) * 100;

        EnvironmentMetric m = new EnvironmentMetric();
        m.setEnvironmentId(env.getEnvironmentId());
        m.setCompanyId(env.getCompanyId());
        m.setReportingYear(env.getReportingYear());

        m.setEnergyUseIntensity(eui);
        m.setRenewableEnergyPercent(renewable);
        m.setDataCenterPue(pue);
        m.setWaterPerEmployee(water);
        m.setEwasteRecyclingPercent(ewaste);
        m.setRecycledWaterPercent(recycledWaterPercent);

        m.setElectricityCo2Emission(elecCo2);
        m.setDieselCo2Emission(dieselCo2);
        m.setTotalCo2Emission(totalCo2);
        m.setCarbonIntensity(carbon);
        m.setCalculatedAt(LocalDateTime.now());

        return m;
    }
}