## Here's a high level architecture design for a highly available, scalable, and cost-effective trading system similar to Binance deployed on AWS (Amazon Web Service)
<br>

### Architecture Overview
The system is designed with **high availability, low-latency, and scalability** in mind, using a **microservices-based architecture**, deployed across multiple AWS Availability Zones (AZs). Below is an architecture diagram of the services used and what role they play in the system.

#### Architecture Diagram
[architecture_diagram](./AWS Trading System Diagram.png)

#### Architecture Diagram Components
- **Clients (Users, API Intergations)**
  - Access the system via Web, Mobile App, or REST APIs.
- **AWS Global CDN (Amazon CloudFront)**
  - Ensures low-latency access for users worldwide by caching static assets.
- **API Gateway (Amazon API Gateway)**
  - Manages REST API requests and handles authentication.
- **Load Balancer (Application Load Balancer - ALB)**
  - Distributed requests among backend services.
- **Microservices Layer (ECS Fargate, EKS)**
  - **User Management (Cognito/RDS PostgreSQL):**
    - Handles user authentication, authorization, and profile management.
    - **Amazon Cognito:** Manages user sign-up, sign-in, multi-factor authentication (MFA), and identification parties (Google, Apple, etc.).
    - **RDS PostgreSQL:** Stores user data, permissions, and preferences in a relational database.
    - Ensures secure authentication and role-based access control.
  - **Wallet & Funds Service (DynamoDB/PostgreSQL):**
    - Manages user account balances, deposit, withdrawals, and transaction history.
    - **DynamoDB(NoSQL, high-performance):**
      - Handles real-time wallet balance updates.
      - Processes high-frequency transactions with low-latency reads/write.
    - **PostgreSQL:**
      - Ensures data integrity for critical financial records.
  - **Order Management Service (DynamoDB/Aurora PostgreSQL):**
    - Manages order lifecycle from placement to execution/cancellation.
    - **DynamoDB (high-speed storage for active orders):**
      - Stores pending and active orders in real time.
      - Enables quick lookups for order book processing.
    - **Aurora PostgreSQL (RDBMS for historical records & analytics):**
      - Stores executed orders, cancellations, and trade history.
      - Supports reporting, compliance, and reconciliation tasks.
  - **Market Data Service (Elasticsearch/OpenSearch):**
    - Stores and retrieves real-time and historical market data for analytics.
    - **Elasticsearch/Opensearch (Distributed search & analytics engine):**
      - Indexes real-time trade executions, price feeds, order book updates.
      - Enables fast search and retrieval of historical trading data.
  - **Trading Service (Elastic Kubernetes Cluster):**
    - The core service that processes buy/sell orders with ultra-low latency.
    - Ensures fast execution by leveraging Kubernetes for container orchestration.
    - Can handle high throughput and scale dynamicaly to accommodate market fluctuations.
- **Data Storage**
  - Aurora PostgreSQL - For transactional data (trades, users).
  - DynamoDB - For NoSQL requirements (orders, user balances).
  - Amazon S3 - For storing historical trade logs, reports.
- **Real-time Messaging (Amazon SNS/SQS, Kafka)**
  - SNS/SQS - Event-driven architecture for trade notifications.
  - MSK (Kafka) - For low-latency event streaming between services.
- **Caching Layer (ElastiCache - Redis)**
  - Improves response time for frequently accessed data.
- **Logging & Monitoring**
  - AWS CloudWatch - Centralized logging & metric monitoring.
  - AWS X-Ray - Tracing to diagnose latency issues.
  - Prometheus/Grafana - Observability for Kubernetes services.
- **Security**
  - AWS WAF - Protects against DDoS, SQL Injection.
  - AWS Shield - DDoS protection.
  - IAM Roles & Policies - Secure access control.
  - Secrets Manager - Manages API keys, database credentials.

### Why each cloud service is used and what alternatives considered
| **Service** | **Why Used?** | **Alternative Considered** |
|------------|-------------|---------------------------|
| **Amazon CloudFront** | Global CDN for caching assets, reducing latency. | Cloudflare CDN |
| **Amazon API Gateway** | Secure API management and request throttling. | Kong API Gateway, Nginx |
| **Amazon Cognito** | Managed authentication (MFA, SSO, OAuth). | Auth0, Firebase Authentication |
| **Amazon RDS (PostgreSQL)** | Strong consistency, relational storage. | MySQL, Aurora Serverless |
| **Amazon DynamoDB** | Low-latency NoSQL storage for real-time balances, orders. | MongoDB Atlas, Cassandra |
| **Amazon OpenSearch (Elasticsearch)** | Real-time market data indexing. | Algolia, Solr |
| **Amazon EKS (Kubernetes)** | Orchestrates trading microservices. | ECS Fargate, Google Kubernetes Engine (GKE) |
| **Amazon MSK (Kafka)** | Event streaming for order execution, price updates. | RabbitMQ, Apache Pulsar |
| **Amazon ElastiCache (Redis)** | Caches hot data, reduces database load. | Memcached, self-hosted Redis |
| **AWS WAF + Shield** | Protects APIs against cyber threats. | Cloudflare WAF, Imperva |
### Plans for scaling when the product grows
