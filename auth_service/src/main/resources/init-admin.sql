-- SQL Script to initialize the default Admin
-- Note: The password 'admin@123' is hashed using BCrypt as required by the system.

INSERT INTO admins (id, email, password, role, created_at)
VALUES (
    gen_random_uuid(), 
    'admin@esg.com', 
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 
    'ROLE_ADMIN', 
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;
