
# SynQ/Synq – Full Application README (Production Version)

## 🌿 Overview
BamBam یک شبکه اجتماعی کامل است که امکانات پیام‌رسان Real-time و اکسپلور مدیا را در یک تجربه‌ی سریع و مینیمال ترکیب می‌کند.  
این نسخه، نسخه اصلی پروژه است: Angular + .NET 9 + MongoDB + SignalR.

---

## ⭐ Features
### 🔐 Authentication (Identity + JWT)
- Register / Login
- Refresh Token
- Role-based Access
- ذخیره نشست کاربر

### 💬 Real-Time Chat (SignalR)
- ارتباط لحظه‌ای
- وضعیت آنلاین
- ذخیره پیام‌ها در MongoDB
- Bubble UI

### 📸 Explore
- آپلود عکس
- گرید 3×3
- Like / Unlike
- نمایش پست‌ها

### 👤 Profile
- اطلاعات کاربر
- ویرایش پروفایل
- گالری پست‌ها

---

## 🧱 Tech Stack
**Frontend:** Angular 19/20 + SCSS + Angular Material  
**Backend:** .NET 9 Web API + Identity + JWT + SignalR  
**Database:** MongoDB

---

## ⚙ Backend Setup
```
cd api
dotnet restore
dotnet run
```

Modify `appsettings.json`:
```
"Mongo": "mongodb://localhost:27017/bambamdb"
```

---

## 💻 Frontend Setup
```
cd client
npm install
ng serve -o
```

Modify `environment.ts`:
```
apiUrl: "http://localhost:5000/api",
hubUrl: "http://localhost:5000/hubs/"
```

---

## 📁 Data Models
### User
- id, displayName, email, passwordHash, profilePhotoUrl, createdAt

### Message
- id, senderId, receiverId, message, sentAt, seen

### Media
- id, userId, imageUrl, caption, tags[], postedAt, likes[]

---

## 🛣 Roadmap
- V2: Angular Routing (Done)
- V3: Auth + JWT
- V4: Media Upload
- V5: Real-time Chat (SignalR)
- V6: Notifications
- V7: Groups

---

## 🙌 Author
**Amir S. – Full-stack Developer**
Amir S. (Full-stack Developer)
Technologies: Angular, .NET, MongoDB
Project: BamBam Social Platform


---

📜 License
MIT License

Copyright (c) 2025 Amir

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software.
...

---
