package com.esg.report_service.service;

import com.esg.report_service.dto.SocialMetricInputDTO;
import com.esg.report_service.entity.EsgKpiResult;
import com.esg.report_service.entity.EsgPillar;
import com.esg.report_service.entity.EsgReport;
import com.esg.report_service.entity.KpiStatus;
import com.esg.report_service.util.SocialBenchmarkConstants;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocialReportService {
    public void evaluate(
            SocialMetricInputDTO m,
            EsgReport report,
            List<EsgKpiResult> results
    ) {

        add("WOMEN_WORKFORCE", m.getWomenWorkforce(),
                SocialBenchmarkConstants.WOMEN_WORKFORCE_MIN,
                m.getWomenWorkforce() >= SocialBenchmarkConstants.WOMEN_WORKFORCE_MIN,
                report, results);

        add("WOMEN_LEADERSHIP", m.getWomenLeadership(),
                SocialBenchmarkConstants.WOMEN_LEADERSHIP_MIN,
                m.getWomenLeadership() >= SocialBenchmarkConstants.WOMEN_LEADERSHIP_MIN,
                report, results);

        add("ATTRITION", m.getAttrition(),
                SocialBenchmarkConstants.ATTRITION_MAX,
                m.getAttrition() <= SocialBenchmarkConstants.ATTRITION_MAX,
                report, results);

        add("TRAINING", m.getTraining(),
                SocialBenchmarkConstants.TRAINING_HOURS_MIN,
                m.getTraining() >= SocialBenchmarkConstants.TRAINING_HOURS_MIN,
                report, results);

        add("SATISFACTION", m.getSatisfaction(),
                SocialBenchmarkConstants.SATISFACTION_MIN,
                m.getSatisfaction() >= SocialBenchmarkConstants.SATISFACTION_MIN,
                report, results);

        add("INSURANCE", m.getInsurance(),
                SocialBenchmarkConstants.INSURANCE_COVERAGE_MIN,
                m.getInsurance() >= SocialBenchmarkConstants.INSURANCE_COVERAGE_MIN,
                report, results);

        add("LTIFR", m.getLtifr(),
                SocialBenchmarkConstants.LTIFR_MAX,
                m.getLtifr() <= SocialBenchmarkConstants.LTIFR_MAX,
                report, results);

        add("MENTAL_HEALTH", m.getMentalHealth(),
                SocialBenchmarkConstants.MENTAL_HEALTH_COVERAGE_MIN,
                m.getMentalHealth() >= SocialBenchmarkConstants.MENTAL_HEALTH_COVERAGE_MIN,
                report, results);
    }

    private void add(
            String kpi,
            Float actual,
            Float benchmark,
            boolean pass,
            EsgReport report,
            List<EsgKpiResult> results
    ) {
        EsgKpiResult r = new EsgKpiResult();
        r.setReport(report);
        r.setKpiName(kpi);
        r.setActualValue(actual);
        r.setBenchmarkValue(benchmark);
        r.setStatus(pass ? KpiStatus.PASS : KpiStatus.FAIL);
        r.setPillar(EsgPillar.SOCIAL);
        results.add(r);
    }
}
