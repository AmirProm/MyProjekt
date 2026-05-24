***

markdown
# 🌐 Synq — Real-time Social Platform

<div align="center">

[⚡ High Performance] • [🚀 Real-time Communication] • [🎨 Minimalist UI]

![GitHub License](https://img.shields.io/github/license/amirali-safaee/synq?style=for-the-badge)
![Angular Version](https://img.shields.io/badge/Angular-19-red?style=for-the-badge&logo=angular)
![.NET Version](https://img.shields.io/badge/.NET-8.0-blue?style=for-the-badge&logo=dotnet)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![SignalR](https://img.shields.io/badge/SignalR-000000?style=for-the-badge&logo=signalr)

*A distraction-free, modern social experience built for speed.*

</div>

---

## 💡 Overview
Synq is a high-performance, modern social platform engineered to eliminate digital noise. By focusing on real-time interactions and a clean, minimalist UI, Synq provides a seamless environment for users to connect, share, and engage.

## 🏗 Architecture
The application leverages a robust, decoupled architecture designed for scalability and low-latency communication.


mermaid
graph LR
    A[Client - Angular 19] -- WebSocket/SignalR --> B(ASP.NET Core API)
    B -- Driver/LINQ --> C[(MongoDB)]
    B -- Identity --> D[Auth System]


## ✨ Key Capabilities

| Feature | Technology | Benefit |
| :--- | :--- | :--- |
| Real-time Messaging | SignalR | Instantaneous, low-latency communication |
| Minimalist Feed | Angular Material | Distraction-free, clean UX |
| Identity | Microsoft Identity | Secure and robust authentication |
| Data Engine | MongoDB | Highly flexible and scalable data storage |

---

## 🖼 Preview
*(Add your image links below)*

| Dashboard Overview | Profile Interface |
| :---: | :---: |
| ![Dashboard](https://github.com/AmirProm/Synq/blob/main/screanshot%2FDashboard.png) | ![Profile](./screenshots/profile.png) |

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- Node.js: v18+
- .NET SDK: v8+
- MongoDB: (Local instance or MongoDB Atlas)

### 2. Backend Setup

bash
cd API
dotnet restore
# Configure your connection string in appsettings.json
dotnet run


### 3. Frontend Setup

bash
cd client
npm install
ng serve --open


---

## 🗺 Roadmap
- [ ] ❤️ Interactions: Implement post likes and threaded comments.
- [ ] 🔔 Notifications: Real-time push alerts for user activity.
- [ ] 👥 Networking: Full follow/followers system.
- [ ] 🌙 Theming: Integrated Dark Mode support.

---

## 🤝 Contributing
Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add: AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License.

<p align="center">
Developed with ❤️ by <b>Amirali Safaee</b>
</p>


***