# Subscription API Platform - Backend

Node.js/Express backend providing:
- User authentication with JWT
- User and subscription plan management (normal, premium, ultra)
- Plan-gated API endpoint demonstrating different behavior per plan
- SQLite (via Sequelize) for persistence
- Swagger/OpenAPI documentation at /api/docs

## Getting Started

1) Create environment configuration
- Copy `.env.example` to `.env`
- Update variables as needed (especially `JWT_SECRET`)

2) Install dependencies
- npm install

3) Start the server
- npm start
- Backend will run on PORT (default 4003)

4) Configure frontend
- Set REACT_APP_API_BASE_URL to point to this backend, e.g.:
  REACT_APP_API_BASE_URL=http://localhost:4003

## API

- POST /api/auth/signup
- POST /api/auth/login
- GET  /api/user/me
- GET  /api/plan
- PUT  /api/plan
- POST /api/execute

See interactive API docs at /api/docs
