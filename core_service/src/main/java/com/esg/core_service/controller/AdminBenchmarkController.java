package com.esg.core_service.controller;

import com.esg.core_service.entity.BenchmarkStandard;
import com.esg.core_service.service.BenchmarkStandardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/benchmarks")
@RequiredArgsConstructor
public class AdminBenchmarkController {

    private final BenchmarkStandardService standardService;

    @GetMapping
    public ResponseEntity<List<BenchmarkStandard>> getAll() {
        return ResponseEntity.ok(standardService.getAllStandards());
    }

    @PutMapping("/{kpiName}")
    public ResponseEntity<BenchmarkStandard> updateStandard(
            @RequestHeader("X-User-Role") String role,
            @PathVariable String kpiName,
            @RequestParam float newValue) {

        // Basic check for ADMIN role from header (Gateway forwards this)
        if (!"ROLE_ADMIN".equals(role)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(standardService.updateStandard(kpiName, newValue));
    }
}
