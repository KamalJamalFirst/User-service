# User Management Service 👥

This is a backend service for managing users, built with **TypeScript, Express, and TypeORM**.  
It includes all the core functionalities of a user management system: **registration, authentication, and access control**.  
The code follows a **clean, layered architecture** to stay maintainable and easy to extend.

---

## ✨ Features

This service provides the following key functionalities via its API endpoints:

- 👤 **User Registration** – Create a new user account with a unique email.  
- 🔑 **User Authorization** – Log in to receive an authentication token (JWT).  
- 📄 **Get User by ID** – Retrieve a single user's details *(restricted to admins or the user themselves)*.  
- 📋 **Get All Users** – Access a list of all registered users *(admins only)*.  
- 🚫 **Block User** – Change a user's status to inactive *(admins or the user themselves)*.  

---

## 💻 Technologies Used

- **TypeScript** – Strong typing, catching errors early.  
- **Express.js** – Minimal and flexible Node.js framework.  
- **TypeORM** – Database ORM, working with SQLite here.  
- **SQLite** – Lightweight, file-based database (perfect for dev/test).  
- **tsoa** – Auto-generates Swagger (OpenAPI) docs + request validation.  
- **Zod** – Schema declaration & validation library.  

---

## 🚀 Getting Started

### Prerequisites
- [Node.js (LTS)](https://nodejs.org/)  
- [npm](https://www.npmjs.com/)  

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install dependencies
npm install
```

### Running the Project
```bash
# Build from TypeScript to JavaScript
npm run build

# Start the service
npm run start
```

The service will now be running at 👉 **http://localhost:3000**

---

## 📄 API Documentation

Once running, interactive Swagger docs are available at:

➡️ [http://localhost:3000/docs](http://localhost:3000/docs)

This page shows all endpoints, parameters, and expected responses.  

---

## 📂 Project Structure

```
src/
├── config/       # Application configurations
├── controllers/  # Handle HTTP requests
├── decorators/   # Custom decorators (used with tsoa)
├── entity/       # TypeORM entities (DB schema)
├── helpers/      # Utility functions
├── interface/    # Shared TypeScript interfaces & types
├── schema/       # Zod schemas for validation
```

---

## 📊 Example API Table

| Endpoint             | Method | Auth Required | Role      |
|----------------------|--------|---------------|-----------|
| `/users/register`    | POST   | ❌            | Public    |
| `/users/:id`         | GET    | ✅            | Admin/User|
| `/users`             | GET    | ✅            | Admin     |
| `/users/disable/:id` | PUT    | ✅            | Admin/User|
 
---

## ☑️ To-Do / Roadmap
- [x] Implement JWT authentication  
- [x] Add Swagger docs with tsoa  
- [x] Add role-based permissions  
- [ ] Add unit & integration tests  

---

## 📸 Example Screenshot
![Swagger Screenshot](https://via.placeholder.com/600x200.png?text=Swagger+UI+Docs)

---

## 🤝 Contribution

Contributions are welcome!  

1. Fork the repo  
2. Create a branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "Add feature"`)  
4. Push the branch (`git push origin feature/your-feature`)  
5. Open a Pull Request 🎉  

---

## 📜 License
This project is licensed under the **MIT License** – see [LICENSE](LICENSE) for details.

---

> *“Good documentation is just as important as good code.”* 💡
