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

### Market Data

- `GET /api/market-data` - Get latest market data for all symbols
- `GET /api/market-data/:symbol` - Get latest market data for specific symbol

### Clients

- `GET /api/clients` - Get all clients
- `GET /api/clients/:clientId` - Get specific client details

### Positions

- `GET /api/positions/:clientId` - Get positions for a specific client
- `POST /api/positions` - Add or update a position

### Margin

- `GET /api/margin/status/:clientId` - Calculate and return margin status
- `POST /api/margin/loans/:clientId` - Update loan amount for a client

## Request/Response Examples

### GET /api/market-data

Response:

```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "price": "175.50",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "symbol": "MSFT",
      "price": "325.75",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/positions

Request:

```json
{
  "symbol": "AAPL",
  "quantity": 100,
  "costBasis": "150.25",
  "clientId": "123e4567-e89b-12d3-a456-426614174000"
}
```

Response:

```json
{
  "success": true,
  "message": "Position created successfully"
}
```

### GET /api/margin/status/:clientId

Response:

```json
{
  "success": true,
  "data": {
    "clientId": "123e4567-e89b-12d3-a456-426614174000",
    "loanBalance": 25000,
    "marginRequirement": 15000,
    "totalMarketValue": 50000,
    "availableMargin": 35000,
    "excessMargin": 10000,
    "marginUtilization": 71.43
  }
}
```

This project was created using `bun init` in bun v1.2.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
