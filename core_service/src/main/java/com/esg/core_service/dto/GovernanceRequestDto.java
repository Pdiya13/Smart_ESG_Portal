package com.esg.core_service.dto;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GovernanceRequestDto {

    private Integer reportingYear;
    private Integer totalBoardMembers;
    private Integer independentDirectors;
    private Integer femaleDirectors;
    private Integer boardMeetings;
    private Float independentAttendancePercent;
    private Boolean dataPrivacyCompliant;
    private Boolean iso27001Certified;
    private Integer cybersecurityIncidents;
    private Integer whistleblowerComplaints;
    private Integer complaintsResolved;
    private Integer antiCorruptionViolations;
}