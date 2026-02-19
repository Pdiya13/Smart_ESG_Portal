package com.esg.report_service.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class CoreServiceClient {


    private final WebClient webClient;


    public CoreServiceClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8082").build();
    }

    public Mono<Object> getEnvironmentData(UUID companyId, Integer year) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/environment/submit/report-data")
                        .queryParam("reportingYear", year)
                        .build())
                .header("X-Company-Id", companyId.toString())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnNext(data ->
                        System.out.println("Environment response from Core: " + data))
                .doOnError(error ->
                        System.out.println("Environment ERROR: " + error.getMessage()));
    }

    public Mono<Object> getSocialData(UUID companyId, Integer year) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/social/submit/report-data")
                        .queryParam("reportingYear", year)
                        .build())
                .header("X-Company-Id", companyId.toString())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnNext(data ->
                        System.out.println("Social response from Core: " + data))
                .doOnError(error ->
                        System.out.println("Social ERROR: " + error.getMessage()));
    }

    public Mono<Object> getGovernanceData(UUID companyId, Integer year) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/governance/submit/report-data")
                        .queryParam("reportingYear", year)
                        .build())
                .header("X-Company-Id", companyId.toString())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnNext(data ->
                        System.out.println("Governance response from Core: " + data))
                .doOnError(error ->
                        System.out.println("Governance ERROR: " + error.getMessage()));
    }
}