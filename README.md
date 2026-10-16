# AriaShop API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-ioredis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <strong>A production-ready RESTful API for a modern multi-vendor e-commerce platform</strong>
</p>

---

## Overview

**AriaShop** is a complete backend solution for online marketplaces. It provides secure authentication, product catalog management, multi-seller support, shopping cart, order processing, online payments, and more — all built with a clean modular architecture.

The API is fully documented with **OpenAPI 3.0 (Swagger)** and ready for both development and production environments.

---

## Key Features

| Feature                    | Description                                              |
|---------------------------|----------------------------------------------------------|
| **OTP Authentication**    | Secure login/register via SMS verification codes         |
| **JWT & Role-based Access** | Access & Refresh tokens with ADMIN / USER / SELLER roles |
| **Multi-seller Support**  | Sellers can manage their own products and inventory      |
| **Product Catalog**       | Categories, subcategories, filters, slug-based URLs      |
| **Image Upload**          | Multi-image product gallery with Multer                  |
| **Shopping Cart**         | Persistent cart with stock validation                    |
| **Order Management**      | Full order lifecycle with status updates                 |
| **Online Payment**        | Zarinpal payment gateway integration                     |
| **Comments & Replies**    | Product reviews with nested replies                      |
| **Personal Notes**        | Private notes on products for each user                  |
| **Short Links**           | Clean short URLs for products                            |
| **Location Data**         | Provinces and cities of Iran                             |
| **Swagger Documentation** | Interactive API docs at `/apies`                         |

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Caching & OTP Store**: Redis (ioredis)
- **Authentication**: Passport.js + JWT
- **Validation**: Yup
- **File Upload**: Multer
- **Payment Gateway**: Zarinpal
- **API Documentation**: swagger-jsdoc + swagger-ui-express
- **Logging**: Winston

---

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Redis](https://redis.io/)
- An SMS service account for sending OTP codes

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AriaShop-API.git
cd AriaShop-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open the `.env` file and fill in the required values:

```env
PORT=3000
MONGOURI=mongodb://localhost:27017/shop
ACCESSTOKEN_SECRET_KEY=your_strong_secret_key
ACCESSTOKEN_EXPIRE_IN=1d
REFRESHTOKEN_SECRET_KEY=your_refresh_secret_key
REFRESHTOKEN_EXPIRE_IN=7d
COOKIE_PARSER=your_cookie_secret
REDIS_URI=redis://localhost:6379
SMS_API_KEY=your_sms_api_key
SMS_PATTERN_CODE=your_sms_pattern_code
```

### 4. Start the server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on the port defined in your `.env` file (default: `3000`).

---

## API Documentation

Once the server is running, open the interactive Swagger documentation:

```
http://localhost:3000/apies
```

All endpoints, request/response schemas, and authentication methods are fully documented there.

---

## Project Structure

```
AriaShop-API/
├── app.js                  # Express application setup & route mounting
├── server.js               # Server bootstrap, DB & Redis connection
├── config.app.js           # Environment configuration
├── redis.js                # Redis client instance
├── package.json
├── .env.example
├── README.md
└── src/
    ├── docs/               # OpenAPI 3.0 YAML documentation files
    ├── module/             # Feature modules (auth, product, cart, ...)
    │   ├── auth/
    │   ├── user/
    │   ├── product/
    │   ├── cart/
    │   ├── orders/
    │   ├── checkout/
    │   └── ...
    ├── middleware/         # Global error handler
    ├── utils/              # Token generation, OTP, Passport strategies
    ├── service/            # External services (SMS)
    ├── helper/             # Standardized response helpers
    ├── public/             # Static assets (product images, icons)
    └── cities/             # Iran provinces & cities data
```

---

## Main Endpoints

| Method | Endpoint                  | Description                        | Auth Required |
|--------|---------------------------|------------------------------------|---------------|
| POST   | `/auth/send`              | Send OTP code                      | No            |
| POST   | `/auth/verify`            | Verify OTP & receive tokens        | No            |
| GET    | `/auth/me`                | Get current user profile           | Yes           |
| GET    | `/user`                   | List all users (Admin)             | Admin         |
| PUT    | `/user/address`           | Add new address                    | Yes           |
| GET    | `/product`                | List products (with filters)       | No            |
| GET    | `/product/:slug`          | Get single product                 | No            |
| POST   | `/product`                | Create product                     | Admin         |
| POST   | `/cart/add`               | Add item to cart                   | Yes           |
| GET    | `/cart`                   | Get user cart                      | Yes           |
| POST   | `/checkout`               | Initiate payment                   | Yes           |
| GET    | `/checkout/verify`        | Verify payment callback            | No            |
| GET    | `/order`                  | List orders                        | Yes           |
| POST   | `/comment/product/:id`    | Add product comment                | Yes           |
| GET    | `/category`               | List categories                    | No            |
| GET    | `/location/provinces`     | List provinces                     | No            |
| GET    | `/location/city`          | List cities                        | No            |

> Full list of endpoints with detailed schemas is available in the Swagger UI.

---

## Authentication

The API uses **Bearer JWT** authentication.

1. Call `POST /auth/send` with your phone number.
2. Call `POST /auth/verify` with the received OTP code.
3. Use the returned `accessToken` in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

In Swagger UI, click the **Authorize** button at the top and paste your token.

---

## Roles

| Role     | Access Level                                      |
|----------|---------------------------------------------------|
| `USER`   | Basic customer features (cart, orders, comments)  |
| `SELLER` | Manage own store and products                     |
| `ADMIN`  | Full access to all resources                      |

The first registered user automatically receives the `ADMIN` role.

---

## Scripts


| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start the server in development mode     |
| `npm start`     | Start the server in production mode      |
| `npm run prod`  | Start the server with NODE_ENV=production |
---

## License

This project is licensed under the **MIT License**.

---

<p align="center">
  Built with ❤️ for modern e-commerce
</p>
