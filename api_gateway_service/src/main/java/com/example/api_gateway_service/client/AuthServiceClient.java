package com.example.api_gateway_service.client;

import com.example.api_gateway_service.dto.TokenIntrospectResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class AuthServiceClient {

    private final WebClient webClient;

    public AuthServiceClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<TokenIntrospectResponse> validateToken(String token) {

        return webClient.post()
                .uri("http://localhost:8081/auth/introspect")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(TokenIntrospectResponse.class);
    }
}