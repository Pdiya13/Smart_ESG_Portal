package com.esg.core_service.util;

import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

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
}
