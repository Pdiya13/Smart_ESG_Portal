package com.esg.auth.auth_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String role; // COMPANY or ADMIN
}