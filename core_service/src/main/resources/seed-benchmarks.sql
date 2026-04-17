-- SQL Script to seed the global benchmark standards
-- CATEGORY: ENVIRONMENT, SOCIAL, GOVERNANCE

INSERT INTO benchmark_standards (id, category, kpi_name, benchmark_value, comparison_type, description, updated_at) VALUES
-- Environment Standards
(gen_random_uuid(), 'ENVIRONMENT', 'EUI', 110.0, 'LESS_THAN', 'Energy Use Intensity (kWh/m²)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'ENVIRONMENT', 'RENEWABLE_PERCENT', 30.0, 'GREATER_THAN', 'Renewable Energy %', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'ENVIRONMENT', 'PUE', 1.6, 'LESS_THAN', 'Data Center Power Usage Effectiveness', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'ENVIRONMENT', 'WATER_PER_EMP', 40.0, 'LESS_THAN', 'Water consumption per employee (L/day)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'ENVIRONMENT', 'EWASTE_RECYCLE', 90.0, 'GREATER_THAN', 'E-waste recycling rate (%)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'ENVIRONMENT', 'CARBON_INTENSITY', 80.0, 'LESS_THAN', 'Carbon intensity (kg CO₂/m²)', CURRENT_TIMESTAMP),

-- Social Standards
(gen_random_uuid(), 'SOCIAL', 'WOMEN_WORKFORCE', 40.0, 'GREATER_THAN', 'Women in total workforce (%)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SOCIAL', 'WOMEN_LEADERSHIP', 20.0, 'GREATER_THAN', 'Women in leadership roles (%)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SOCIAL', 'ATTRITION', 15.0, 'LESS_THAN', 'Annual attrition rate (%)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SOCIAL', 'TRAINING', 20.0, 'GREATER_THAN', 'Average training hours per employee', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SOCIAL', 'SATISFACTION', 75.0, 'GREATER_THAN', 'Employee satisfaction score (0-100)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SOCIAL', 'INSURANCE', 100.0, 'EQUALS', 'Employees covered by health insurance (%)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SOCIAL', 'LTIFR', 0.3, 'LESS_THAN', 'Lost Time Injury Frequency Rate', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SOCIAL', 'MENTAL_HEALTH', 50.0, 'GREATER_THAN', 'Mental health support coverage (%)', CURRENT_TIMESTAMP),

-- Governance Standards (Initial defaults)
(gen_random_uuid(), 'GOVERNANCE', 'BOARD_INDEPENDENCE', 50.0, 'GREATER_THAN', 'Independent board members (%)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'GOVERNANCE', 'FEMALE_DIRECTORS', 33.0, 'GREATER_THAN', 'Female directors on board (%)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'GOVERNANCE', 'ATTENDANCE', 90.0, 'GREATER_THAN', 'Board meeting attendance (%)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'GOVERNANCE', 'WHISTLEBLOWER_RESOLUTION', 100.0, 'EQUALS', 'Whistleblower complaints resolved (%)', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'GOVERNANCE', 'BOARD_MEETINGS', 4.0, 'GREATER_THAN', 'Number of board meetings per year', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'GOVERNANCE', 'CYBER_INCIDENTS', 0.0, 'LESS_THAN', 'Major cybersecurity incidents', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'GOVERNANCE', 'ANTI_CORRUPTION', 0.0, 'LESS_THAN', 'Confirmed incidents of corruption', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'GOVERNANCE', 'DATA_PRIVACY', 1.0, 'BOOLEAN', 'Data privacy policy in place', CURRENT_TIMESTAMP),
(gen_random_uuid(), 'GOVERNANCE', 'ISO_27001', 1.0, 'BOOLEAN', 'ISO 27001 Certification status', CURRENT_TIMESTAMP)
ON CONFLICT (kpi_name) DO UPDATE SET 
    benchmark_value = EXCLUDED.benchmark_value,
    comparison_type = EXCLUDED.comparison_type;
