package com.esg.auth.auth_service.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex)
    {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        response.put("timestamp", Instant.now());
        response.put("status", 400);
        response.put("errorType", "VALIDATION_ERROR");
        response.put("errors", errors);

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,Object>> handleRunTime(RuntimeException ex)
    {
        Map<String, Object> response = new HashMap<>();

        response.put("timestamp", Instant.now());
        response.put("status", 400);
        response.put("errorType" , "BAD_REQUEST");
        response.put("message", ex.getMessage());

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials() {
        return ResponseEntity.status(401).body(
                Map.of(
                        "timestamp", Instant.now(),
                        "status", 401,
                        "errorType", "UNAUTHORIZED",
                        "message", "Invalid Email Or Password"
                )
        );
    }

}