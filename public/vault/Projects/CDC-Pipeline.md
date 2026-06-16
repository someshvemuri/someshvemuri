---
tags: [project, data, cdc]
date: 2026-01-18
---

# Sample CDC Pipeline

A Change Data Capture (CDC) implementation for streaming database changes.

## Overview

This project captures changes from a source database and publishes them as events to a message broker.

## Architecture

```
Source DB → CDC Connector → Event Formatter → Kafka Topic → Consumer Applications
```

## Key Components

### 1. CDC Connector
- Polls database transaction logs
- Detects INSERT, UPDATE, DELETE operations
- Maintains LSN/SCN tracking

### 2. Event Formatter
- Converts database changes to JSON events
- Adds metadata (timestamp, operation type)
- Implements event schema

### 3. Kafka Producer
- Publishes events to Kafka topics
- Ensures idempotency
- Handles backpressure

### 4. Consumer Applications
- Subscribe to topics
- Process events in order
- Update local state

## Technologies

- Java 11+
- Kafka/Confluent Platform
- PostgreSQL/MySQL
- Spring Boot

## Setup

See [[Portfolio Project]] for setup instructions.

## Status

- [x] Initial implementation
- [x] Error handling
- [ ] Performance optimization
- [ ] Monitoring and alerting
