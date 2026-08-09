# 🚀 CivicAI — AI-Powered Civic Issue Resolution Platform

> **Turn civic problems into action.**

CivicAI is an AI-powered civic issue reporting and resolution platform that helps citizens report local problems and automatically analyzes, classifies, prioritizes, and routes them to the appropriate department.

🌐 **Live Demo:** https://civicai-frontend-qoas.onrender.com

---

## 🎯 Problem Statement

Citizens frequently face civic problems such as potholes, damaged roads, garbage issues, water problems, and other infrastructure concerns.

Traditional complaint systems can make reporting and routing these issues difficult because citizens may need to determine the appropriate category and department themselves.

## 💡 Our Solution

CivicAI simplifies civic issue reporting through a single platform.

A citizen can submit an issue, after which CivicAI analyzes the report and provides:

- 🧠 Issue classification
- 🚨 Priority detection
- 🏢 Recommended department
- 📝 AI-generated summary
- 🔧 Recommended action
- 📊 Issue status tracking

---

## ✨ Key Features

### 🤖 AI-Powered Issue Analysis

CivicAI analyzes submitted civic complaints and determines the relevant category, priority, and responsible department.

### 🏷️ Smart Classification

Issues are categorized into relevant civic categories.

### 🚨 Priority Detection

Each issue is assigned a priority level to help identify problems that may require faster attention.

### 🏢 Department Routing

CivicAI recommends the department responsible for handling the reported issue.

### 📊 Live Dashboard

The dashboard displays live information such as:

- Total Reports
- High Priority Reports
- Resolved Reports
- AI Assisted Reports

### 🔄 Issue Status Tracking

Reports can move through different stages:

`Reported → In Progress → Resolved`

Status changes are persisted in the database and remain available after refreshing the application.

### 💾 Persistent Data

Civic reports are stored in PostgreSQL, allowing submitted issues and their status to persist across page refreshes.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Java
- Spring Boot
- REST APIs
- Spring Data JPA
- Hibernate

### Database

- PostgreSQL

### AI

- AI-powered issue analysis
- Issue classification
- Priority detection
- Department routing
- AI-generated summary and recommended action

### Deployment

- Render
- GitHub

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## 🏗️ Architecture

CivicAI follows a simple full-stack architecture:

```text
                    👤 Citizen
                        │
                        ▼
              ┌──────────────────┐
              │   React + Vite   │
              │    Frontend      │
              └────────┬─────────┘
                       │ REST API
                       ▼
              ┌──────────────────┐
              │   Spring Boot    │
              │     Backend      │
              └───────┬──────────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
      ┌─────────────┐   ┌─────────────┐
      │ AI Analysis │   │ PostgreSQL  │
      │ & Routing   │   │  Database   │
      └─────────────┘   └─────────────┘
```

### Deployment Architecture

```text
GitHub Repository
       │
       ├── Frontend
       │      │
       │      ▼
       │   Render Static Site
       │      │
       │      ▼
       │   CivicAI Live Website
       │
       └── Backend
              │
              ▼
          Render Web Service
              │
              ▼
          PostgreSQL
```

---

## 🚀 Deployment

CivicAI is deployed using Render.

### Live Application

🌐 https://civicai-frontend-qoas.onrender.com

### Services

- **Frontend:** React/Vite application deployed as a Render Static Site
- **Backend:** Spring Boot REST API deployed as a Render Web Service
- **Database:** PostgreSQL hosted on Render

The deployed frontend communicates with the deployed Spring Boot backend through REST APIs.

---

## 🔗 Project Links

🌐 **Live Demo:**  
https://civicai-frontend-qoas.onrender.com

💻 **GitHub Repository:**  
https://github.com/kadirisaikumar3/hackdevengers-1.0

---

## 🏆 Hackathon

**HackDevengers 1.0 — 2026**

CivicAI demonstrates how AI can simplify civic issue reporting by transforming citizen complaints into structured, prioritized, and actionable information.

---

## 📄 License

This project is developed for the HackDevengers 1.0 hackathon.
