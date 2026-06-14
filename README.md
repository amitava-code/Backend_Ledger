# 💰 Backend Ledger

A scalable backend system for handling financial transactions, ledger entries, and account management with JWT-based authentication and MongoDB transactional integrity.

> ⚠️ **Status: ~60% Complete** — Core transaction flow and authentication implemented. Advanced features in progress.

---

## 🚀 Tech Stack

![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white)

---

## 📁 Project Structure

```
Backend_Ledger/
│
├── server.js                        ← Entry point
├── package.json
├── .env                             ← Environment variables (not committed)
│
└── src/
    ├── app.js                       ← Express app setup, route mounting
    │
    ├── config/
    │   └── db.js                    ← MongoDB connection
    │
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── account.controller.js
    │   └── transaction.controller.js
    │
    ├── middleware/
    │   └── auth.middleware.js       ← JWT verification (user + system)
    │
    ├── models/
    │   ├── user.model.js
    │   ├── account.model.js
    │   ├── transaction.model.js
    │   └── ledger.model.js
    │
    ├── routes/
    │   ├── auth.routes.js
    │   ├── account.routes.js
    │   └── transaction.routes.js
    │
    └── services/
        └── email.service.js         ← Nodemailer email service
```

---

## 📌 API Endpoints

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT cookie |

---

### 🏦 Accounts — `/api/accounts`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/accounts/` | 🔒 Protected | Create a new account |
| `GET` | `/api/accounts/` | 🔒 Protected | Get all accounts for logged-in user |
| `GET` | `/api/accounts/balance/:accountId` | 🔒 Protected | Get balance of a specific account |

---

### 💸 Transactions — `/api/transactions`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/transactions/` | 🔒 Protected | Create a new transaction |
| `POST` | `/api/transactions/system/inital-funds` | 🔒 System Only | Seed initial funds (system middleware) |

> 🔒 Protected = requires valid JWT token in cookie  
> 🔒 System Only = requires system-level JWT (`authSystemUserMiddleware`)

---

## 🔑 Authentication Flow

```
Client Request
      │
      ▼
authMiddleware (auth.middleware.js)
      │
      ├── Reads JWT from cookie
      ├── Verifies token
      └── Attaches user to req → Controller
```

Two middleware levels:
- `authMiddleware` — for regular authenticated users
- `authSystemUserMiddleware` — for internal system operations (e.g. seeding funds)

---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/amitava-code/Backend_Ledger.git
cd Backend_Ledger
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ledger_db
JWT_SECRET=your_jwt_secret_here
JWT_SYSTEM_SECRET=your_system_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4. Run the server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

---

## 🧪 Test the API

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Create Account (with cookie from login)
curl -X POST http://localhost:3000/api/accounts/ \
  -H "Content-Type: application/json" \
  --cookie "token=<your_jwt_here>"
```

---

## 📊 Data Models

| Model | Description |
|---|---|
| `user.model.js` | User credentials and profile |
| `account.model.js` | Financial account per user |
| `transaction.model.js` | Debit/credit transaction records |
| `ledger.model.js` | Double-entry ledger entries |


---

## 👨‍💻 Author

**Amitava Biswas** — Backend Developer (Learning Phase 🚀)

---

## 🤝 Contributing

This is a personal learning project. Contributions and suggestions are welcome — feel free to open an issue or PR.