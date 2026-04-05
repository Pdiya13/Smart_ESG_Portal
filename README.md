# Microservices Based ESG Reporting System

## Docker Containerized Deployment (Recommended)

To run the entire Smart ESG Portal stack effortlessly in an isolated environment, we utilize Docker. 

**Requirements:**
- Docker & Docker Compose installed

**Start everything via Docker (including DB configurations mapped implicitly to your neonDB cloud instances):**
```bash
docker compose build
docker compose up -d
```
All services (Eureka, Gateway, Auth, Core, Report, ML, and Frontend) will spin up automatically over the `esg-network`. Wait for about a minute for Eureka to fully register all instances.

*To view logs for all services:*
```bash
docker compose logs -f
```

*To stop everything:*
```bash
docker compose down
```

---

## Manual / Local Development Setup

If you prefer to run services manually for local development, follow the steps below.

### 1. Database Configuration
Ensure your cloud database connection is correctly specified in the respective `application.properties` of the Java backend services (`auth_service`, `core_service`, `report_service`). You are using Neon DB cloud instances:

```properties
spring.datasource.url=jdbc:postgresql://ep-autumn-term-adeocdmo.c-2.us-east-1.aws.neon.tech:5432/authdb
spring.datasource.username=neondb_owner
spring.datasource.password=npg_QEMyswFeHz25
```

### 2. Start the Service Registry

```bash
cd eureka-server
./mvnw spring-boot:run
```
The registry will start on port `8761`.

### 3. Start the Java Backend Services

Start each of the following in separate terminals (in any order after the registry is up):

```bash
cd api_gateway_service && ./mvnw spring-boot:run
cd auth_service        && ./mvnw spring-boot:run
cd core_service        && ./mvnw spring-boot:run
cd report_service      && ./mvnw spring-boot:run
```

### 4. Start the ML Service (Python / FastAPI)

```bash
cd ml_service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The ML Service will register with Eureka and handles ESG scoring predictions and data analytics.

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.
