# Synq ⚡

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![SignalR](https://img.shields.io/badge/SignalR-RealTime-0078D4?style=for-the-badge&logo=microsoft&logoColor=white)](https://dotnet.microsoft.com/en-us/apps/aspnet/signalr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 📌 Executive Summary

**Synq** is a high-performance, distributed real-time communication platform engineered to deliver low-latency messaging and seamless user collaboration. Built with a focus on modern software engineering paradigms, the system leverages a decoupled architecture, ensuring strict segregation of duties between the presentation layer and the core domain logic. 

Designed for scalability from day one, Synq acts as a robust foundation for enterprise-grade chat and synchronization services.

## 📐 System Architecture

The following diagram illustrates the high-level data flow and system boundaries of the Synq platform. It highlights the separation between the client infrastructure, the application API, and the persistence/real-time layers.
```mermaid
graph TD
Client[Angular 19 SPA] -->|HTTPS/REST| API[".NET 8 API (Clean Architecture)"]
Client -->|WebSockets/WSS| SignalR[SignalR Hub]

API -->|CQRS| ApplicationLayer[Application Layer]
ApplicationLayer -->|Entity Framework Core / Driver| DB[(MongoDB)]

SignalR -->|Pub/Sub| MessageBus((Redis Backplane*))
MessageBus -.-> DB

subgraph Infrastructure
DB
MessageBus
end

subgraph Core
API
ApplicationLayer
SignalR
end

classDef primary fill:#0078D4,stroke:#fff,stroke-width:2px,color:#fff;
classDef secondary fill:#4EA94B,stroke:#fff,stroke-width:2px,color:#fff;
class Client,API,SignalR primary;
class DB,MessageBus secondary;
*\*Redis Backplane mapped for horizontal scaling phase.*

## 🛠 Technical Deep-Dive

The technology stack was selected based on strict criteria regarding performance, maintainability, and developer ergonomics:

| Component | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Frontend** | Angular 19 | Utilizing standalone components and Signals for highly optimized, zone-less change detection and superior rendering performance. |
| **Backend API** | .NET 8 (C#) | Chosen for its best-in-class JIT/AOT performance, robust memory management, and extensive enterprise ecosystem. |
| **Persistence** | MongoDB | A NoSQL document model provides the high-write-throughput and schema flexibility required for fast-evolving chat and event data. |
| **Real-time** | ASP.NET Core SignalR | Abstracts underlying transport mechanisms (WebSockets, Server-Sent Events, Long Polling) providing a resilient real-time duplex channel. |

## 🛡 Security & Scalability

### Authentication & Session Management
- **Stateless Authentication:** Implements stateless JWT (JSON Web Tokens) for API authorization.
- **Refresh Token Rotation:** Mitigates the risk of compromised access tokens by employing short-lived JWTs alongside secure, HTTP-only refresh tokens stored securely on the client.
- **Hub Security:** SignalR endpoints are secured using bearer tokens passed via connection protocols, ensuring real-time streams are authenticated at the handshake level.

### Scalability Strategy
- **Horizontal Scaling:** The backend is stateless, allowing seamless horizontal scaling behind a reverse proxy/load balancer.
- **Real-time Distribution:** Future-proofed for a Redis Backplane to synchronize SignalR messages across multiple server nodes, preventing WebSocket connection bottlenecks.

## ⚙️ Engineering Principles

The codebase strictly adheres to industry-standard software design patterns:
1. **Clean Architecture:** Strict dependency rules. Domain entities have zero knowledge of infrastructure or presentation concerns.
2. **SOLID Principles:** Interfaces are segregated, and dependencies are injected, ensuring high testability.
3. **CQRS (Command Query Responsibility Segregation):** Read and write operations are logically separated, paving the way for targeted optimizations and potential event sourcing.

## 🚀 Setup & Infrastructure

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v20+)](https://nodejs.org/) & Angular CLI
- [Docker & Docker Compose](https://www.docker.com/) (for infrastructure)

### Local Development Environment

1. **Clone the repository:**
   
```bash
   git clone https://github.com/AmirProm/Synq.git
   cd Synq
