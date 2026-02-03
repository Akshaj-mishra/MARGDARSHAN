# Markdarshan 🚚 - An Intelligent Truck Routing and Fleet Management System


![Status: In Development](https://img.shields.io/badge/status-in%20development-brightgreen)
![Backend: Node.js](https://img.shields.io/badge/backend-Node.js-blue)
![Frontend: React](https://img.shields.io/badge/frontend-React-cyan)

**Markdarshan** is a comprehensive logistics platform designed to optimize truck routing and fleet management. It consists of a mobile application for drivers and a web-based dashboard for fleet owners, working together to provide efficient, safe, and cost-effective routing solutions.

---

## 📋 Table of Contents

- [Markdarshan 🚚 - An Intelligent Truck Routing and Fleet Management System](#markdarshan----an-intelligent-truck-routing-and-fleet-management-system)
  - [📋 Table of Contents](#-table-of-contents)
  - [🎯 Aim](#-aim)
  - [✨ Key Features](#-key-features)
    - [📱 Driver's Mobile Application](#-drivers-mobile-application)
    - [🖥️ Owner's Central Dashboard](#️-owners-central-dashboard)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🔬 Theoretical Foundation](#-theoretical-foundation)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [👥 Our Team](#-our-team)

---

## 🎯 Aim

The primary aim of this project is to develop **Markdarshan**, a system that intelligently integrates real-time data, vehicle constraints, and driver amenities to find the optimal route. This platform aims to **reduce operational costs**, **improve delivery times**, **enhance driver safety**, and provide owners with powerful tools for **data-driven decision-making**.

---

## ✨ Key Features

### 📱 Driver's Mobile Application

-   **🚛 Truck-Specific Navigation**: Generates routes considering truck dimensions (height, weight), load type, and road restrictions.
-   **⚡ Dynamic Real-Time Routing**: Uses live traffic, weather, and road closure data to suggest the fastest path and offer on-the-fly re-routing.
-   **⛽ Smart POI Integration**: Intelligently suggests optimal stops for rest, refuelling, and maintenance along the route.
-   **🗺️ Offline Maps**: Allows for seamless navigation even in areas with poor or no internet connectivity.
-   **💬 Communication Hub**: Enables direct communication and document sharing between the driver and the fleet owner.

### 🖥️ Owner's Central Dashboard

-   **📍 Live Fleet Tracking**: Provides a real-time map view of the entire fleet's location, speed, and status.
-   **🛠️ Resource Management**:
    -   **Fuel Management**: Monitors fuel consumption, mileage, and idling time.
    -   **Driver Management**: Tracks driver hours to ensure compliance with safety regulations.
    -   **Vehicle Maintenance**: Schedules alerts for routine maintenance.
-   **🌐 Geofencing and Alerts**: Creates virtual boundaries and sends instant notifications when a truck enters or exits a specific area.
-   **📊 Advanced Analytics**: Generates detailed reports on trip history, delivery times, and driver performance.
-   **🔄 Route Optimization & Dispatching**: Plans and dispatches routes for multiple vehicles efficiently, solving complex logistical challenges like the Vehicle Routing Problem (VRP).

---

## 🛠️ Tech Stack

-   **Frontend (Dashboard & Mobile App):** React, React Native, Redux, Mapbox GL JS
-   **Backend:** Node.js, Express.js, Socket.IO
-   **Database:** PostgreSQL with PostGIS for geospatial queries, MongoDB
-   **Routing & Optimization:** OSRM, Custom Python Scripts (for VRP algorithms)
-   **APIs:** Google Maps API, OpenWeatherMap API
-   **DevOps:** Docker, AWS/Vercel

---

## 🔬 Theoretical Foundation

This project is built upon established research in logistics and computer science. The core routing engine leverages algorithms and heuristics studied in the following domains:

-   **The Vehicle Routing Problem (VRP)**: For finding the optimal set of routes for a fleet of vehicles.
-   **VRP with Time Windows (VRPTW)**: For scheduling deliveries and mandatory rest stops within specific time frames.
-   **Ant Colony Optimization & Metaheuristics**: For solving complex Capacitated VRP (CVRP) to handle vehicle load capacities efficiently.
-   **Green Vehicle Routing Problem (G-VRP)**: For optimizing fuel consumption and suggesting cost-effective refuelling stops.

The system's real-time tracking component is based on integrating **GPS** and **GSM** technologies for accurate location monitoring and data transmission.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   Git

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Akshaj-mishra/MARGDARSHAN.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd Markdarshan
    ```
3.  **Install backend dependencies:**
    ```sh
    cd server
    npm install
    ```
4.  **Install frontend dependencies:**
    ```sh
    cd ../client
    npm install
    ```
5.  **Set up environment variables:**
    -   Create a `.env` file in the `server` directory and add your API keys (e.g., Google Maps, Database URI).
6.  **Run the application:**
    -   Start the backend server: `npm start` in the `/server` directory.
    -   Start the frontend client: `npm start` in the `/client` directory.

---

## 👥 Our Team

| Name              | Role                           
| ----------------- | ------------------------------
| **Swastik Mishra** | Backend Developer              
| **Akshaj Mishra** | Backend Developer              
| **Aryan Kumar** | Frontend Developer             
| **Ritika Kushwaha** | Frontend Developer             
| **Subash Rahul** | Research & Documentation 

---

