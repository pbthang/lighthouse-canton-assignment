# Lighthouse Canton Backend

A backend API for managing client positions, market data, and margin accounts.

## Setup

To install dependencies:

```bash
bun install
```

To run the development server:

```bash
bun run dev
```

## Database Setup

To generate database migrations:

```bash
bun run db:generate
```

To apply migrations:

```bash
bun run db:migrate
```

To seed the database with sample data:

```bash
bun run db:seed
```

## API Endpoints

- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Authenticate user and return access token
- `GET /api/auth/me` - Retrieve authenticated user's profile information
- `GET /api/market-data/` - Fetch current market data for all tracked symbols
- `GET /api/market-data/{symbol}` - Fetch current market data for a specific symbol
- `GET /api/market-data/time-series/{symbol}?interval={interval}&dates={dates}` - Fetch historical market data for a specific symbol
- `GET /api/clients/` - Get a list of all clients
- `GET /api/clients/{clientId}` - Get detailed information for a specific client
- `GET /api/positions/{clientId}` - Retrieve all portfolio positions for a specific client
- `POST /api/positions/` - Create or update a position for a client
- `GET /api/margin/{clientId}` - Calculate and return margin status for a specific client
- `POST /api/margin/loans/{clientId}` - Add or update loan information for a specific client

This project was created using `bun init` in bun v1.2.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
