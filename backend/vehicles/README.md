# EV Rental Station - Vehicles API

This is service for managing vehicles in the micro-services.

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Example:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/car_db?schema=public"
PORT=8099
```

### 3. Apply database schema

```bash
npx prisma migrate dev --name init
```

### 4. Seed database

Using the raw SQL file with command line:

```bash
psql $DATABASE_URL -f src/database/seed.sql
```

or copy then paste to QueryTool in Database management

### 5. 🚀 Start the Server

```bash
npm run dev
```

## Database Schema

Models

- Brand → One-to-many with Car

- Category → Many-to-many with Car

- Car → Central model with prices, brand, specs, and images

- CarImage → Linked 1:N with Car

- CarSpecification → Linked 1:N with Car and SpecificationType

- SpecificationType → Defines the specification metadata

## API Documentation

The API provides the following resources:

- [Categories](#categories)
- [Brands](#brands)
- [Specification Types](#specification-types)
- [Vehicles](#vehicles)
- [Notifications](#notifications)

---

### Categories

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| GET    | /v1/categories     | Get all categories          |
| GET    | /v1/categories/:id | Get a single category by ID |
| POST   | /v1/categories     | Create a new category       |
| PUT    | /v1/categories/:id | Update a category by ID     |
| DELETE | /v1/categories/:id | Delete a category by ID     |

---

### Brands

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| GET    | /v1/brands     | Get all brands           |
| GET    | /v1/brands/:id | Get a single brand by ID |
| POST   | /v1/brands     | Create a new brand       |
| PUT    | /v1/brands/:id | Update a brand by ID     |
| DELETE | /v1/brands/:id | Delete a brand by ID     |

---

### Specification Types

| Method | Endpoint                    | Description                           |
| ------ | --------------------------- | ------------------------------------- |
| GET    | /v1/specification-types     | Get all specification types           |
| GET    | /v1/specification-types/:id | Get a single specification type by ID |
| POST   | /v1/specification-types     | Create a new specification type       |
| PUT    | /v1/specification-types/:id | Update a specification type by ID     |
| DELETE | /v1/specification-types/:id | Delete a specification type by ID     |

---

### Vehicles

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| GET    | /v1/vehicles     | Get all vehicles           |
| GET    | /v1/vehicles/:id | Get a single vehicle by ID |
| POST   | /v1/vehicles     | Create a new vehicle       |
| PUT    | /v1/vehicles/:id | Update a vehicle by ID     |
| DELETE | /v1/vehicles/:id | Delete a vehicle by ID     |

#### Vehicle Images

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| GET    | /v1/vehicles/:carId/images | Get all images for a vehicle |
| POST   | /v1/vehicles/:carId/images | Add an image to a vehicle    |

#### Vehicle Specifications

| Method | Endpoint                           | Description                          |
| ------ | ---------------------------------- | ------------------------------------ |
| GET    | /v1/vehicles/:carId/specifications | Get all specifications for a vehicle |
| POST   | /v1/vehicles/:carId/specifications | Add a specification to a vehicle     |

## Rest API Example Requests

Example Data Flow:

1️⃣ Create a Brand → get brandId
2️⃣ Create a Category → get categoryId
3️⃣ Create a SpecificationType → get specificationTypeId
4️⃣ Create a Car → use the brand & category IDs
5️⃣ Add Car Images → use carId
6️⃣ Add Car Specs → use carId + specificationTypeId

### 1. Create a Brand

```bash
curl -X POST http://localhost:3000/api/brands \
-H "Content-Type: application/json" \
-d '{
  "displayName": "Toyota",
  "description": "Reliable Japanese manufacturer",
  "thumbnailUrl": "https://loremflickr.com/320/240/toyota"
}'
```

### 2. Create a Category

```bash
curl -X POST http://localhost:3000/api/categories \
-H "Content-Type: application/json" \
-d '{
  "displayName": "SUV",
  "description": "Sport Utility Vehicle",
  "thumbnailUrl": "https://loremflickr.com/320/240/suv"
}'
```

### 3. Create a Specification Type

```bash
curl -X POST http://localhost:3000/api/specification-types \
-H "Content-Type: application/json" \
-d '{
  "label": "Engine Power",
  "icon": "engine.svg",
  "description": "Measured in horsepower"
}'
```

### 4. Create a Vehicle

```bash
curl -X POST http://localhost:3000/api/cars \
-H "Content-Type: application/json" \
-d '{
  "regularPrice": "55000.00",
  "salePrice": "50000.00",
  "depositPrice": "10000.00",
  "quantity": 10,
  "isInStock": true,
  "description": "A premium family SUV with hybrid technology.",
  "thumbnailUrl": "https://loremflickr.com/640/480/car",
  "brandId": "REPLACE_WITH_BRAND_ID",
  "categoryIds": ["REPLACE_WITH_CATEGORY_ID"]
}'
```

### 5. Create a Car Image

```bash
curl -X POST http://localhost:3000/api/cars/98ff32f7-bd38-4d4a-ae8a-08c1d57a33c0/images \
-H "Content-Type: application/json" \
-d '{
  "url": "https://loremflickr.com/1280/720/car,side",
  "sort": 1
}'
```

### 6. Create Car Specifications

```bash
curl -X POST http://localhost:3000/api/cars/98ff32f7-bd38-4d4a-ae8a-08c1d57a33c0/specifications \
-H "Content-Type: application/json" \
-d '{
  "value": "200 HP",
  "specificationTypeId": "REPLACE_WITH_SPECIFICATION_TYPE_ID"
}'
```
