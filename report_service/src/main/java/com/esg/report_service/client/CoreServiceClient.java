package com.esg.report_service.client;

import com.esg.report_service.dto.EsgScoreDTO;
import com.esg.report_service.dto.MetricBreakdownDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CoreServiceClient {

    private final WebClient.Builder webClientBuilder;

    private WebClient client() {
        return webClientBuilder
                .baseUrl("http://localhost:8082")
                .build();
    }

    // ==============================
    // Get ESG Score By Year
    // ==============================
    public Mono<EsgScoreDTO> getEsgScore(UUID companyId, Integer year) {

        return client()
                .get()
                .uri("/core/esg-score/{year}", year)
                .header("X-Company-Id", companyId.toString())
                .retrieve()
                .onStatus(
                        status -> status == HttpStatus.NOT_FOUND,
                        response -> Mono.empty()
                )
                .bodyToMono(EsgScoreDTO.class)
                .onErrorResume(e -> Mono.empty());
    }

    // ==============================
    // Get All ESG Scores
    // ==============================
    public Mono<List<EsgScoreDTO>> getAllEsgScores(UUID companyId) {

        return client()
                .get()
                .uri("/core/esg-score/all")
                .header("X-Company-Id", companyId.toString())
                .retrieve()
                .bodyToFlux(EsgScoreDTO.class)
                .collectList()
                .onErrorResume(e -> Mono.empty());
    }

    // ==============================
    // Get KPI Metrics
    // ==============================
    public Mono<MetricBreakdownDTO> getMetrics(UUID companyId, Integer year) {

        return client()
                .get()
                .uri("/core/metrics/{year}", year)
                .header("X-Company-Id", companyId.toString())
                .retrieve()
                .onStatus(
                        status -> status == HttpStatus.NOT_FOUND,
                        response -> Mono.empty()
                )
                .bodyToMono(MetricBreakdownDTO.class)
                .onErrorResume(e -> Mono.empty());
    }
}