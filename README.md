<p align="center">
  <img src="https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 19" />
  <img src="https://img.shields.io/badge/.NET-8-512BD4?style=for-the-badge&logo=.net&logoColor=white" alt=".NET 8" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/SignalR-5C2D91?style=for-the-badge&logo=dotnet&logoColor=white" alt="SignalR" />
</p>

<h1 align="center">Synq</h1>

<p align="center">
  <b>A real-time social platform engineered for clarity, speed, and low-noise interaction.</b>
</p>

<p align="center">
  Synq is built around a simple idea: modern social products should feel instantaneous, lightweight, and focused.
  It combines a minimalist client, a decoupled backend, secure authentication, and real-time chat to create a clean interaction layer for online communication.
</p>

<p align="center">
  <a href="#architecture">Architecture</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="#contributing">Contributing</a>
</p>

---

## Why Synq Exists

Most social platforms accumulate noise faster than value:
- too many surfaces,
- too many interruptions,
- too much visual clutter,
- too much latency between action and response.

**Synq is the opposite of that.**

It is designed to prioritize:
- **real-time communication**
- **minimalist user experience**
- **fast feedback loops**
- **clean separation between client, API, and persistence**
- **secure authentication with token refresh support**

The result is a platform that feels direct, responsive, and intentionally reduced to the interactions that matter.

---

## Core Product Philosophy

Synq is not trying to be “everything.”

It is intentionally focused on:
- **chat-first interaction**
- **clean, low-distraction UI**
- **predictable backend boundaries**
- **scalable data persistence**
- **a foundation suitable for team-driven evolution**

This makes the project useful both as:
1. a practical social app, and  
2. a strong engineering base for future features, hosting, collaboration, and platform growth.

---

## Architecture

Synq follows a decoupled client-server design:
```mermaid
graph LR
UI[Angular 19 Client] -->|HTTP / SignalR| API[ASP.NET Core API]
API -->|Queries / Commands| DB[(MongoDB)]
API -->|Authentication / Refresh Tokens| AUTH[Identity Layer]
UI -->|Real-time Chat| HUB[SignalR Hub]
HUB --> API
