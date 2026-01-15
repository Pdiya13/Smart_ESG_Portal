package com.esg.core_service.util;

import com.esg.core_service.entity.Social;
import com.esg.core_service.entity.SocialMetric;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@NoArgsConstructor
public class SocialFormulaUtil {

    // Women Workforce % = (women / total) * 100
    public static float womenWorkforce(int women, int total) {
        return (women * 100f) / total;
    }

    // Women in Leadership % = (women managers / total managers) * 100
    public static float womenLeadership(int womenManagers, int totalManagers) {
        return (womenManagers * 100f) / totalManagers;
    }

    // Attrition Rate % = (left / total employees) * 100
    public static float attrition(int left, int total) {
        return (left * 100f) / total;
    }

    // Hiring Rate % = (joined / total employees) * 100
    public static float hiring(int joined, int total) {
        return (joined * 100f) / total;
    }

    // Training hours per employee
    public static float trainingPerEmployee(float totalTraining, int totalEmployees) {
        return totalTraining / totalEmployees;
    }

    // Insurance Coverage %
    public static float insuranceCoverage(int covered, int total) {
        return (covered * 100f) / total;
    }

    // Mental Health Coverage %
    public static float mentalHealthCoverage(int covered, int total) {
        return (covered * 100f) / total;
    }

    // Injury Rate (LTIFR)
    public static float ltifr(int injuries, float totalHours) {
        return (injuries * 1_000_000f) / totalHours;
    }

    // Remote Work %
    public static float remotePercent(int remote, int total) {
        return (remote * 100f) / total;
    }

    // AUTO KPI CALCULATION FROM ENTITY
    public static SocialMetric calculateAll(Social s) {

        float womenWorkforce = womenWorkforce(
                s.getWomenEmployees(), s.getTotalEmployees());

        float womenLeadership = womenLeadership(
                s.getWomenManagers(), s.getTotalManagers());

        float attrition = attrition(
                s.getEmployeesLeft(), s.getTotalEmployees());

        float hiring = hiring(
                s.getEmployeesJoined(), s.getTotalEmployees());

        float training = trainingPerEmployee(
                s.getTotalTrainingHours(), s.getTotalEmployees());

        float insurance = insuranceCoverage(
                s.getHealthInsuranceCovered(), s.getTotalEmployees());

        float mental = mentalHealthCoverage(
                s.getMentalHealthProgramCovered(), s.getTotalEmployees());

        float ltifr = ltifr(
                s.getWorkplaceInjuries(), s.getTotalWorkHours());

        float remote = remotePercent(
                s.getRemoteEmployees(), s.getTotalEmployees());

        SocialMetric m = new SocialMetric();
        m.setSocialId(s.getSocialId());
        m.setCompanyId(s.getCompanyId());
        m.setReportingYear(s.getReportingYear());

        m.setWomenWorkforcePercent(womenWorkforce);
        m.setWomenLeadershipPercent(womenLeadership);
        m.setAttritionRate(attrition);
        m.setHiringRate(hiring);
        m.setTrainingPerEmployee(training);
        m.setInsuranceCoveragePercent(insurance);
        m.setMentalHealthCoveragePercent(mental);
        m.setLtifr(ltifr);
        m.setRemoteWorkPercent(remote);

        m.setCalculatedAt(LocalDateTime.now());
        return m;
    }
}