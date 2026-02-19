package com.example.api_gateway_service.filter;

import com.example.api_gateway_service.client.AuthServiceClient;
import com.example.api_gateway_service.dto.TokenIntrospectResponse;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter {

    private final AuthServiceClient authServiceClient;

    public JwtAuthenticationFilter(AuthServiceClient authServiceClient) {
        this.authServiceClient = authServiceClient;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        System.out.println("Incoming path: " + path);

        if (path.startsWith("/auth")) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        return authServiceClient.validateToken(token)
                .doOnNext(response -> {
                    System.out.println("Introspect valid: " + response.isValid());
                    System.out.println("CompanyId: " + response.getCompanyId());
                })
                .flatMap(response -> {

                    if (!response.isValid()) {
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    }

                    return chain.filter(
                            exchange.mutate()
                                    .request(exchange.getRequest()
                                            .mutate()
                                            .header("X-Company-Id", response.getCompanyId())
                                            .build())
                                    .build()
                    );
                });
    }
}