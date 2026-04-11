# Smart ESG Portal — Microservices Based Reporting System

Smart ESG Portal is a full-stack, microservices-based application that helps companies compute, manage, and track their Environmental, Social, and Governance (ESG) scores. It supports user authentication, multi-metric benchmarking, reporting analytics, predictive machine learning capabilities, and dynamic caching for high-speed dashboards.

## Features

- **User Authentication** — Secure login and session management powered by JWT authentication and an API Gateway.
- **ESG Score Calculation** — Dedicated modules to calculate core ESG metrics across Environment, Social, and Governance domains.
- **Benchmarking & Ratings** — Automatically computes corporate scores against historical benchmarks to assign letter-grade ratings.
- **Reporting Analytics Dashboard** — Fast, aggregated visualization of annual ESG tracking, generated automatically from underlying records.
- **Machine Learning Integration** — Analytics and predictive scoring powered by an isolated Python FastAPI microservice.
- **Centralized Service Discovery** — Built upon Spring Cloud Netflix Eureka to effortlessly route all HTTP communication transparently.
- **Redis Response Caching** — Aggressive memory caching via Spring Data Redis. All historical ESG metrics, domain reports, and analytics dashboards are cached automatically under a 60-minute TTL. Read operations respond in under 50ms, while any uploaded data triggers immediate synchronous cache evictions across the cluster to eliminate stale data.


## Technical Architecture

The application relies on a robust and scalable ecosystem uniquely selected for enterprise microservice reliability.

| Architectural Domain | Framework Assembly | Primary Functionality |
| :--- | :--- | :--- |
| **Client Portal** | React + Node.js | Delivers responsive UI dashboards and asynchronous HTTP interactions. |
| **Java Micro-Core** | Java 21, Spring Boot 4.0.1 | Powers the backend API matrix, orchestration, and business rules. |
| **Data Science Layer**| Python, FastAPI | Hosts predictive analytics and secondary numeric model processes. |
| **Network Gateway** | Spring Cloud Gateway | Manages edge security, JWT interception, and external routing. |
| **Discovery Registry**| Spring Cloud Netflix Eureka | Facilitates internal service discovery and dynamic load-balancing lookups. |
| **Persistent Storage**| PostgreSQL (Neon Cloud DB) | Houses relational domains: users, core ESG metrics, and benchmark logs. |
| **Memory Buffer** | Spring Cache + Redis | Supercharges dashboard speeds by serving pre-calculated reporting payloads. |
| **Orchestration** | Docker Compose | Bundles the complete topology into seamlessly deployable environments. |

## Network Topography

Smart ESG Portal isolates distinct domain logic into the following containerized execution units:

| Container Handle / Service | Internal Port | Environment | Core Duty within Topology |
| :--- | :---: | :--- | :--- |
| `eureka-server` | `8761` | Java Runtime | The decentralized phonebook registering active microservices locally. |
| `api-gateway` | `8080` | Java Runtime | Front-facing gatekeeper authenticating JWTs and distributing edge traffic. |
| `auth-service` | `8081` | Java Runtime | Issues authorization bearer tokens and controls user lifecycle identities. |
| `core-service` | `8082` | Java Runtime | Absorbs ESG uploads, computes strict metric scales, and pushes DB edits. |
| `report-service` | `8083` | Java Runtime | Rapidly returns assembled business dashboards via Redis cache intercepts. |
| `ml-service` | `8000` | Python Env | Evaluates historic progression through trained statistical machine learning. |
| `frontend` | `5173` | React Engine | Provides users with interactive visualizations of their corporate scores. |
| `redis` | `6379` | Native | Synchronizes real-time data invalidations and caches shared backend reads. |

## Getting Started

### Prerequisites
- Docker & Docker Compose installed
- Java 21+ and Maven
- Python 3.11+
- Node.js 18+

### Run with Docker Compose (Recommended)

To run the entire stack effortlessly, utilize our Docker implementation. Internal service-to-service URLs and database connections to NeonDB are wired dynamically.

```bash
docker compose up -d --build
```
All services will spin up automatically over the `esg-network`. Wait for about a minute for Eureka to fully register all instances. You can view the frontend at `http://localhost:5173`.

### Manual / Local Development Setup

If you prefer to run services manually for local development, follow the steps below. Ensure your cloud database connection is correctly specified in the respective `application.properties` (e.g., `spring.datasource.url`).

**1. Start the Service Registry**
```bash
cd eureka-server
./mvnw spring-boot:run
```

**2. Start the Java Backend Services**
Start each of the following in separate terminals:
```bash
cd api_gateway_service && ./mvnw spring-boot:run
cd auth_service        && ./mvnw spring-boot:run
cd core_service        && ./mvnw spring-boot:run
cd report_service      && ./mvnw spring-boot:run
```

**3. Start the ML Service**
```bash
cd ml_service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**4. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Implementation Deep-Dives

### ⚡ Caching & Performance Optimization
To combat severe network latency constraints imposed by the cloud Neon database, a robust three-tier memory caching infrastructure was applied.

1. **Layer 1: Report Dashboard Acceleration** 
   - Uses `spring-boot-starter-data-redis` to cache the highly-intensive `dashboard_data` endpoint in `report-service`. This brings loading speeds for year-over-year dashboard visits down to tens of milliseconds. Total system read throughput dramatically improved bypassing the core network calls entirely.
2. **Layer 2: Core Read Scaling** 
   - All localized reads from `core_service` (such as tracking isolated Environmental, Governance, and Social metrics, as well as calculating final `esg_scores`) are instantly committed to Redis on the first lookup. Caching employs a 60-minute TTL fallback using decoupled JSON Serializers natively defined inside `RedisConfig.java`.
3. **Layer 3: Synchronous Cross-Service Invalidation** 
   - A single shared instance of Redis spans both microservices. Whenever a company submits a new metrics spreadsheet, an explicit synchronous `@CacheEvict(allEntries = true)` runs in the `core_service`, purposefully targeting the `env_report`, `esg_scores`, AND the remote `dashboard_data` tags. 
   - This architectural choice securely promises strict O(1) reads without risking users looking at stale caching data out of sync. High availability is securely maintained by discarding the repetitive logic inside `AnnualReportSnapshotRepository` duplicate handling.
