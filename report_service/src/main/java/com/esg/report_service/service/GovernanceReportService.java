package com.esg.report_service.service;

import com.esg.report_service.dto.GovernanceMetricInputDTO;
import com.esg.report_service.entity.EsgKpiResult;
import com.esg.report_service.entity.EsgReport;
import com.esg.report_service.util.GovernanceBenchmarkConstants;
import org.springframework.stereotype.Service;
import com.esg.report_service.entity.KpiStatus;
import com.esg.report_service.entity.EsgPillar;

import java.util.List;

@Service
public class GovernanceReportService {
    public void evaluate(GovernanceMetricInputDTO m, EsgReport report, List<EsgKpiResult> results)
    {
        add("ATTENDANCE", m.getAttendance(),
                GovernanceBenchmarkConstants.ATTENDANCE_MIN,
                m.getAttendance() >= GovernanceBenchmarkConstants.ATTENDANCE_MIN,
                report, results);

        add("BOARD_MEETINGS", m.getBoardMeetings(),
                GovernanceBenchmarkConstants.BOARD_MEETINGS_MIN,
                m.getBoardMeetings() >= GovernanceBenchmarkConstants.BOARD_MEETINGS_MIN,
                report, results);

        add("FEMALE_DIRECTORS", m.getFemaleDirectors(),
                GovernanceBenchmarkConstants.FEMALE_DIRECTORS_MIN,
                m.getFemaleDirectors() >= GovernanceBenchmarkConstants.FEMALE_DIRECTORS_MIN,
                report, results);

        add("DATA_PRIVACY", m.getDataPrivacy(),
                GovernanceBenchmarkConstants.DATA_PRIVACY_MIN,
                m.getDataPrivacy() >= GovernanceBenchmarkConstants.DATA_PRIVACY_MIN,
                report, results);

        add("ISO_27001", m.getIso27001(),
                GovernanceBenchmarkConstants.ISO_27001_MIN,
                m.getIso27001() >= GovernanceBenchmarkConstants.ISO_27001_MIN,
                report, results);

        add("CYBER_INCIDENTS", m.getCyberIncidents(),
                GovernanceBenchmarkConstants.CYBER_INCIDENTS_MAX,
                m.getCyberIncidents() <= GovernanceBenchmarkConstants.CYBER_INCIDENTS_MAX,
                report, results);

        add("WHISTLEBLOWER_RESOLUTION", m.getWhistleblowerResolution(),
                GovernanceBenchmarkConstants.WHISTLEBLOWER_RESOLUTION_MIN,
                m.getWhistleblowerResolution() >= GovernanceBenchmarkConstants.WHISTLEBLOWER_RESOLUTION_MIN,
                report, results);

        add("ANTI_CORRUPTION", m.getAntiCorruption(),
                GovernanceBenchmarkConstants.ANTI_CORRUPTION_MIN,
                m.getAntiCorruption() >= GovernanceBenchmarkConstants.ANTI_CORRUPTION_MIN,
                report, results);

        add("BOARD_INDEPENDENCE", m.getBoardIndependence(),
                GovernanceBenchmarkConstants.BOARD_INDEPENDENCE_MIN,
                m.getBoardIndependence() >= GovernanceBenchmarkConstants.BOARD_INDEPENDENCE_MIN,
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
        r.setPillar(EsgPillar.GOVERNANCE);
        results.add(r);
    }
}
