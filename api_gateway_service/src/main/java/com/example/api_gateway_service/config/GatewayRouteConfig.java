package com.example.api_gateway_service.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRouteConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {

        return builder.routes()

                .route("auth-service", r -> r
                        .path("/auth/**")
                        .uri("lb://AUTH-SERVICE"))

                .route("core-service", r -> r
                        .path("/core/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://CORE-SERVICE"))

                .route("report-service", r -> r
                        .path("/report/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://REPORT-SERVICE"))

                .route("ml-service", r -> r
                        .path("/ml/**")
                        .uri("lb://ML-SERVICE"))

                .build();
    }
}