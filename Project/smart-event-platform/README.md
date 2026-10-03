# Smart Event Management and Online Ticket Booking Platform

A comprehensive, scalable, full-stack microservices-based application built for event discovery, ticket booking, and management. Features a modern Flutter frontend and multiple backend services (FastAPI, Spring Boot, Node.js) orchestrated with Docker and Kafka.

## Features
- **Modern User Experience**: Location-based discovery, categorized browsing, and seamless ticket/seat selection.
- **Roles & Permissions**: Dedicated workflows for Users, Organizers, and Admins.
- **Robust Microservices Backend**:
  - FastAPI (Python) for Core APIs (Auth, Events, Bookings)
  - Spring Boot (Java) for Ticket Inventory & Concurrency Management
  - Node.js (Express) for Notification & Activity Logging
- **Event-Driven Architecture**: Apache Kafka for asynchronous communication.
- **Dual Database Strategy**: PostgreSQL (Transactional data) and MongoDB (Activity logging).

## Tech Stack
- **Frontend**: Flutter (Dart), Riverpod, GoRouter
- **Backend**: FastAPI, Spring Boot, Node.js
- **Databases**: PostgreSQL (3NF, Triggers, Views), MongoDB
- **Infrastructure**: Docker, Docker Compose, Kafka, Zookeeper, GitHub Actions

## Prerequisites
- Docker & Docker Compose
- Flutter SDK (>=3.0.0)
- Python 3.11+ (optional, for local backend development)
- Java 21+ & Maven (optional, for local inventory service development)
- Node.js 18+ (optional, for local notification service development)

## Quick Start (Docker)

1. Clone the repository and navigate to the root directory.
2. Build and start the entire infrastructure:
   ```bash
   docker-compose up --build
   ```
3. The following services will be available:
   - FastAPI Backend: `http://localhost:8000`
   - Node.js Notifications: `http://localhost:3000`
   - Spring Boot Inventory: `http://localhost:8080`
   - PostgreSQL: `localhost:5432`
   - MongoDB: `localhost:27017`
   - Kafka: `localhost:9092`

## Running the Flutter Frontend

1. Ensure the Docker services are running.
2. Navigate to the flutter app:
   ```bash
   cd flutter_app
   flutter pub get
   flutter run
   ```

## Demo Accounts
*Will be populated via database seed scripts*
- **Admin**: admin@example.com / Admin@123
- **Organizer**: organizer@example.com / Organizer@123
- **User**: user@example.com / User@123

## Course Objectives Mapping
- **CO1**: PostgreSQL (Normalization, Triggers, Views, Transactions)
- **CO2**: MongoDB (Activity/NoSQL logging)
- **CO3**: FastAPI backend (REST, JWT, RBAC)
- **CO4**: Node.js & Spring Boot microservices
- **CO5**: Kafka and API gateway integrations
- **CO6**: Docker, CI/CD, Documentation

## License
MIT License