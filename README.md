# TaskForge — TODO REST API

A full-stack Todo application built with **Java Spring Boot**, **MongoDB**, and **React + Vite**.
The backend provides a RESTful API for managing Todo items with full CRUD operations, input validation, pagination, filtering, and global error handling.

\---

## &#x20;Tech Stack

|Category|Technology|
|-|-|
|Backend|Java 17, Spring Boot|
|Frontend|React, Vite|
|Database|MongoDB|
|Build Tool|Maven|
|API Testing|Postman|
|Testing|JUnit, MockMvc|
|Version Control|Git \& GitHub|

\---

## 📁 Project Structure

```text
todo-app/
│
├── README.md
├── postman/
│   └── todo-api.postman\\\_collection.json
│
├── backend/
│   ├── pom.xml
│   ├── .env.example
│   └── src/
│       ├── main/
│       │   ├── java/com/example/todo/
│       │   └── resources/
│       └── test/
│
└── frontend/
    ├── package.json
    ├── .env.example
    ├── index.html
    └── src/
        ├── api/
        ├── App.jsx
        └── index.css
```

\---

## &#x20;Prerequisites

Before running the project, install:

* ✅ Java 17+
* ✅ Maven
* ✅ Node.js 18+
* ✅ npm
* ✅ MongoDB

\---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=8080
MONGODB\\\_URI=mongodb://localhost:27017/todo
```

> Example file: `backend/.env.example`

### Frontend (`frontend/.env`)

```env
VITE\\\_API\\\_BASE\\\_URL=http://localhost:8080
```

> Example file: `frontend/.env.example`

\---

## Running the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR\\\_USERNAME/taskforge.git
cd taskforge
```

### 2️⃣ Start MongoDB

Ensure MongoDB is running locally.

Default database:

```
mongodb://localhost:27017/todo
```

### 3️⃣ Run the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

### 4️⃣ Run the Frontend

Open a new terminal.

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

\---
\---
## 🚀 Production Build

Build the backend and frontend for deployment:

```bash
cd backend
mvn clean package
```

```bash
cd frontend
npm run build
```

Deploy the generated backend JAR and frontend `dist/` directory to your hosting platform.

---

## Live Deployment
|Service|URL|
|-|-|
|Backend API|`https://your-backend.onrender.com`|
|Frontend|`https://your-frontend.vercel.app`|

> Replace the above URLs with your deployed application URLs.

\---

## 📡 API Endpoints

|Method|Endpoint|Description|
|-|-|-|
|GET|`/health`|Check API health|
|POST|`/todos`|Create a Todo|
|GET|`/todos`|Get all Todos|
|GET|`/todos/{id}`|Get Todo by ID|
|PUT|`/todos/{id}`|Update a Todo|
|DELETE|`/todos/{id}`|Delete a Todo|

### Optional Query Parameters

```
GET /todos?page=0\\\&limit=5
GET /todos?completed=true
GET /todos?completed=false
```

\---

## Postman Collection

The Postman collection is available at:

```
postman/todo-api.postman\\\_collection.json
```

The collection uses the variable `{{base\\\_url}}`:

|Environment|Value|
|-|-|
|Local|`http://localhost:8080`|
|Hosted|`https://your-backend.onrender.com`|

\---

## Running Tests

Run backend tests using:

```bash
mvn test
```

\---

## Error Response

All errors return a consistent JSON response.

```json
{
  "error": "Todo not found"
}
```

\---

## Author

**Abhishek Karisanapu**
GitHub: [@bhai-shek](https://github.com/bhai-shek)

\---

<p align="center">Made with ☕ and Spring Boot</p>

