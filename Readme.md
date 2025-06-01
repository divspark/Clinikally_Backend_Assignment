# Product Autocomplete API

A simple REST API built with **Express.js** and **TypeScript** that provides product autocomplete functionality with scoring and pagination.

---

## Features

- Case-insensitive search with smart scoring:
  - `title.startsWith`: +3 points
  - `title.includes`: +2 points
  - `brand.includes`: +1 point
- Paginated results using `limit` and `skip`
- TypeScript for static typing
- Well-structured project with `controllers`, `routes`, `models`
- Robust input validation and error handling
- Easy to run locally or containerize with Docker

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd product-autocomplete-api
````

### 2. Install dependencies

```bash
npm install
```

### 3. Add Product Data

Create a file at `data/products.json` and populate it with product data.

> Sample:

```json
[
  {
    "id": 1,
    "title": "iPhone 14 Pro",
    "brand": "Apple",
    "category": "Smartphones",
    "price": 999.99
  },
  ...
]
```

### 4. Start the server

#### For production:

```bash
npm start
```

#### For development (hot reload):

```bash
npm run dev
```

---

## API Documentation

### `GET /products/search`

Search for products by `title` or `brand`.

#### Query Parameters

| Name  | Type   | Description                                 |
| ----- | ------ | ------------------------------------------- |
| q     | string | Search query (min 2 characters)             |
| limit | number | Results per page (default: 10)              |
| skip  | number | Results to skip for pagination (default: 0) |

#### Example Request

```bash
curl "http://localhost:3000/products/search?q=phone&limit=10&skip=0"
```

#### Success Response

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": 1,
        "title": "iPhone 14 Pro",
        "brand": "Apple",
        "category": "Smartphones",
        "price": 999.99
      }
      // ...
    ],
    "total": 50,
    "limit": 10,
    "skip": 0
  }
}
```

#### Error Response (Invalid Query)

```json
{
  "success": false,
  "message": "Query must be at least 2 characters long"
}
```

---

## Design Documentation

### Project Structure

```
src/
├── controllers/
├── models/
├── routes/
├── utils/
├── data/products.json
```

### 🔎 Search Logic

* Case-insensitive matching
* Scoring:

  * `title.startsWith(q)` → +3
  * `title.includes(q)` → +2
  * `brand.includes(q)` → +1
* Sorted by total score (descending)

### 📊 Pagination

* Controlled via `limit` and `skip`
* Returns total count for client-side control

### 🧪 Edge Cases

* Query less than 2 chars → 400 Bad Request
* Invalid `limit` or `skip` → 400 Bad Request
* No matching results → empty product list with `total: 0`

---

---

## 📌 Assumptions & Limitations

* Data is in-memory from a local JSON file (no external DB)
* Not optimized for large datasets
* No caching or advanced search algorithms


